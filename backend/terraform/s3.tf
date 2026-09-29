# Dois buckets, os dois privados e lidos so pelo CloudFront (OAC):
# - site: o build do SPA, reescrito inteiro a cada deploy (sync --delete);
# - files: as imagens enviadas pelos usuarios, gravadas pela Lambda.
# Separados para que o --delete do deploy do frontend nunca apague imagem.
resource "aws_s3_bucket" "site" {
  bucket = "${var.project_name}-site-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket" "files" {
  bucket = "${var.project_name}-files-${data.aws_caller_identity.current.account_id}"
}

locals {
  # so id e arn: passar o recurso inteiro arrasta atributos deprecados
  buckets = {
    site  = { id = aws_s3_bucket.site.id, arn = aws_s3_bucket.site.arn }
    files = { id = aws_s3_bucket.files.id, arn = aws_s3_bucket.files.arn }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  for_each = local.buckets

  bucket = each.value.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Sem ACLs: o acesso e decidido so pela bucket policy abaixo.
resource "aws_s3_bucket_ownership_controls" "this" {
  for_each = local.buckets

  bucket = each.value.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

data "aws_iam_policy_document" "cloudfront_read" {
  for_each = local.buckets

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${each.value.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    # Sem esta condicao qualquer distribuicao da AWS poderia ler o bucket.
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.app.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "this" {
  for_each = local.buckets

  bucket = each.value.id
  policy = data.aws_iam_policy_document.cloudfront_read[each.key].json

  depends_on = [aws_s3_bucket_public_access_block.this]
}

# O navegador posta a imagem direto no bucket (presigned POST): o CORS libera so
# a origem do proprio app.
resource "aws_s3_bucket_cors_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  cors_rule {
    allowed_methods = ["POST"]
    allowed_origins = ["https://${aws_cloudfront_distribution.app.domain_name}"]
    allowed_headers = ["*"]
    max_age_seconds = 3000
  }
}

# Originais em uploads/ ficam 1 dia: tempo de sobra para o resize e para o
# resgate do ticket; tickets nunca resgatados somem sozinhos.
resource "aws_s3_bucket_lifecycle_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  rule {
    id     = "expira-uploads"
    status = "Enabled"

    filter {
      prefix = "uploads/"
    }

    expiration {
      days = 1
    }
  }
}
