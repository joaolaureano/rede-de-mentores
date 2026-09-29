variable "project_name" {
  description = "Prefixo aplicado ao nome de todos os recursos"
  type        = string
  default     = "rede-de-mentores"
}

variable "aws_region" {
  description = "Regiao onde o ambiente e provisionado"
  type        = string
  default     = "us-east-1"
}

# Segredo preenchido via terraform.tfvars (nao versionado) e guardado no SSM
# Parameter Store, de onde a Lambda o le no cold start.
variable "db_conn_string" {
  description = "Connection string do Postgres no Neon, no formato postgresql://usuario:senha@host/banco?sslmode=require."
  type        = string
  sensitive   = true

  validation {
    condition     = can(regex("^postgres(ql)?://", var.db_conn_string))
    error_message = "A connection string precisa comecar com postgresql:// (ou postgres://)."
  }
}

variable "permissions_boundary_name" {
  description = "Nome da policy usada como permissions boundary das roles criadas aqui. O robot so cria roles com ela; o ARN e montado com o ID da conta em uso, entao nada de especifico de conta fica versionado."
  type        = string
  default     = "robot-ec2-boundary"
}

variable "lambda_package" {
  description = "Zip gerado por `npm run build:lambda` no backend (handler lambda.handler)."
  type        = string
  default     = "../dist-lambda/lambda.zip"
}

# O sharp redimensiona as imagens enviadas dentro da propria requisicao, e
# memoria na Lambda tambem compra CPU. 1024 MB mantem o upload rapido; a
# cobranca e por ms efetivo, entao o resto das rotas nao fica mais caro.
variable "lambda_memory_mb" {
  description = "Memoria da funcao, em MB."
  type        = number
  default     = 1024
}

variable "jwt_expires_in" {
  description = "Validade do token de sessao (formato do jsonwebtoken, ex.: 1d, 12h)."
  type        = string
  default     = "1d"
}

variable "secrets_version" {
  description = "Versao dos segredos write-only. O Terraform nao enxerga o valor gravado, entao so reescreve quando este numero muda: incremente ao trocar um segredo."
  type        = number
  default     = 1
}
