# Resize assincrono do claim check: o upload em uploads/ dispara esta funcao,
# que grava files/<uuid>-resized.jpg - o nome que a API ja gravou no banco ao
# resgatar o ticket. Mesmo pacote da API, outro handler; role propria, com o
# minimo: le uploads/, escreve files/.
resource "aws_iam_role" "resizer" {
  name                 = "${var.project_name}-resizer"
  assume_role_policy   = data.aws_iam_policy_document.assume_lambda.json
  permissions_boundary = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${var.permissions_boundary_name}"
}

resource "aws_cloudwatch_log_group" "resizer" {
  name              = "/aws/lambda/${var.project_name}-resizer"
  retention_in_days = 14
}

data "aws_iam_policy_document" "resizer" {
  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.resizer.arn}:*"]
  }

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.files.arn}/uploads/*"]
  }

  statement {
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.files.arn}/files/*"]
  }
}

resource "aws_iam_role_policy" "resizer" {
  name   = "${var.project_name}-resizer"
  role   = aws_iam_role.resizer.id
  policy = data.aws_iam_policy_document.resizer.json
}

resource "aws_lambda_function" "resizer" {
  function_name = "${var.project_name}-resizer"
  role          = aws_iam_role.resizer.arn
  handler       = "resizer.handler"
  runtime       = "nodejs24.x"
  architectures = ["arm64"]

  filename         = var.lambda_package
  source_code_hash = filebase64sha256(var.lambda_package)

  timeout     = 30
  memory_size = var.lambda_memory_mb

  depends_on = [
    aws_cloudwatch_log_group.resizer,
    aws_iam_role_policy.resizer,
  ]
}

resource "aws_lambda_permission" "resizer_s3" {
  statement_id   = "AllowS3Invoke"
  action         = "lambda:InvokeFunction"
  function_name  = aws_lambda_function.resizer.function_name
  principal      = "s3.amazonaws.com"
  source_arn     = aws_s3_bucket.files.arn
  source_account = data.aws_caller_identity.current.account_id
}

resource "aws_s3_bucket_notification" "files" {
  bucket = aws_s3_bucket.files.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.resizer.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
    filter_suffix       = ".jpg"
  }

  depends_on = [aws_lambda_permission.resizer_s3]
}
