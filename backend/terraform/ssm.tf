# Os segredos ficam no Parameter Store, e nao em variavel de ambiente da
# Lambda: variavel de ambiente e legivel para quem consiga descrever a funcao,
# e a connection string carrega a senha do banco.
# O OAC nao serve para esta API: com assinatura sempre ligada ele sobrescreve o
# header Authorization do cliente. No lugar dele, a Function URL fica publica e
# o CloudFront injeta um segredo de origem que a Lambda exige - quem chamar a
# Function URL direto nao passa.
resource "random_password" "origin_secret" {
  length  = 48
  special = false
}

# Assina os tokens de sessao. Troca-lo desloga todo mundo, e so isso.
resource "random_password" "jwt_key" {
  length  = 64
  special = false
}

locals {
  # a condicao olha so a conta (nao sensivel): for_each nao aceita chaves
  # derivadas de valor sensivel
  email_enabled = var.email_account != ""

  secrets = merge(
    {
      DB_URL        = var.db_conn_string
      JWT_KEY       = random_password.jwt_key.result
      ORIGIN_SECRET = random_password.origin_secret.result
    },
    local.email_enabled ? {
      EMAIL_ACCOUNT  = var.email_account
      EMAIL_PASSWORD = var.email_password
    } : {}
  )

  ssm_prefix = "/${var.project_name}"
}

# value_wo em vez de value: argumento write-only e enviado a AWS mas nao fica
# no terraform.tfstate, que e um arquivo em texto plano no disco de quem
# aplica. Como o Terraform deixa de enxergar o valor, ele nao detecta mudanca
# sozinho - quem troca um segredo incrementa var.secrets_version.
resource "aws_ssm_parameter" "secret" {
  for_each = local.secrets

  name             = "${local.ssm_prefix}/${each.key}"
  type             = "SecureString"
  value_wo         = each.value
  value_wo_version = var.secrets_version
}

# Sem statement de kms:Decrypt: SecureString sem chave propria usa a aws/ssm,
# cuja key policy (gerenciada pela AWS) ja libera decrypt via SSM para qualquer
# principal da conta. O que controla o acesso e o ssm:GetParameters abaixo.
# Por prefixo, e nao parametro a parametro: o ROOT_URL abaixo depende do
# CloudFront, que depende da Lambda, que depende desta policy - listar os ARNs
# fecharia um ciclo. O prefixo e exclusivo do projeto.
data "aws_iam_policy_document" "read_secrets" {
  statement {
    actions   = ["ssm:GetParameter", "ssm:GetParameters"]
    resources = ["arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${local.ssm_prefix}/*"]
  }
}

# Dominio do site, usado no link do e-mail de recuperacao de senha. Nao e
# segredo; esta no SSM so para a Lambda ler sem depender do CloudFront.
resource "aws_ssm_parameter" "root_url" {
  name  = "${local.ssm_prefix}/ROOT_URL"
  type  = "String"
  value = aws_cloudfront_distribution.app.domain_name
}
