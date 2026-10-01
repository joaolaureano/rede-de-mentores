data "aws_iam_policy_document" "assume_lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name                 = "${var.project_name}-api"
  assume_role_policy   = data.aws_iam_policy_document.assume_lambda.json
  permissions_boundary = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${var.permissions_boundary_name}"
}

# Log group criado aqui, e nao pela Lambda no primeiro log: assim a retencao e
# definida desde o inicio e o grupo sai junto num destroy.
resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${var.project_name}-api"
  retention_in_days = 14
}

# Os mesmos poderes da AWSLambdaBasicExecutionRole, porem inline: a policy do
# robot nega iam:AttachRolePolicy explicitamente, entao anexar a versao
# gerenciada nao e uma opcao. Sem CreateLogGroup porque o grupo ja existe.
data "aws_iam_policy_document" "lambda_logs" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.api.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lambda_logs" {
  name   = "${var.project_name}-api-logs"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda_logs.json
}

resource "aws_iam_role_policy" "lambda_read_secrets" {
  name   = "${var.project_name}-api-read-secrets"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.read_secrets.json
}

# Claim check: a API nao toca na imagem. PutObject em uploads/ e o que a
# credencial precisa ter para assinar o presigned POST (quem grava e o
# navegador); GetObject e o que o HeadObject do resgate do ticket exige.
# files/ e escrito so pelo resizer.
data "aws_iam_policy_document" "lambda_uploads" {
  statement {
    actions   = ["s3:PutObject", "s3:GetObject"]
    resources = ["${aws_s3_bucket.files.arn}/uploads/*"]
  }
}

resource "aws_iam_role_policy" "lambda_uploads" {
  name   = "${var.project_name}-api-uploads"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda_uploads.json
}

resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-api"
  role          = aws_iam_role.lambda.arn
  handler       = "lambda.handler"
  runtime       = "nodejs24.x"
  # o build-lambda.sh instala o sharp para linux-arm64: as duas coisas andam juntas
  architectures = ["arm64"]

  filename         = var.lambda_package
  source_code_hash = filebase64sha256(var.lambda_package)

  # O cold start le o SSM e abre conexao TLS com o Neon, que pode estar
  # acordando do scale-to-zero; os 3s padrao sao pouco para isso.
  timeout     = 30
  memory_size = var.lambda_memory_mb

  environment {
    variables = {
      SSM_PREFIX   = local.ssm_prefix
      NODE_ENV     = "production"
      FILES_BUCKET = aws_s3_bucket.files.id
      EXPIRES_IN   = var.jwt_expires_in
      # Gmail SMTP quando email_account esta preenchido; senao as rotas
      # respondem como antes, sem enviar
      EMAIL_ENABLED = tostring(local.email_enabled)
      # os segredos sao lidos do SSM uma vez por container: mudar a versao
      # altera a configuracao da funcao e descarta os containers com o valor velho
      SECRETS_VERSION = tostring(var.secrets_version)
    }
  }

  # Sem VPC de proposito: o Neon e alcancado pela internet publica, e uma
  # Lambda em VPC precisaria de NAT Gateway - sozinho, mais caro que a stack toda.
  depends_on = [
    aws_cloudwatch_log_group.api,
    aws_iam_role_policy.lambda_read_secrets,
    aws_iam_role_policy.lambda_logs,
    aws_iam_role_policy.lambda_uploads,
  ]
}

# NONE, e nao AWS_IAM: com AWS_IAM o acesso so vem assinado, e o OAC que assina
# sobrescreve o header Authorization da aplicacao (o Bearer do JWT). Quem faz o
# papel de fechar a porta e o segredo de origem conferido no handler.
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
}

# Sao duas acoes, nao uma: mesmo com AuthType NONE a Lambda exige
# InvokeFunctionUrl e InvokeFunction na resource policy. So com a primeira o
# endpoint responde 403 sem explicar o que falta.
resource "aws_lambda_permission" "function_url" {
  statement_id           = "AllowPublicFunctionUrl"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.api.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "function_url_invoke" {
  statement_id  = "AllowPublicFunctionUrlInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "*"
}
