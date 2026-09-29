# Politicas gerenciadas pela AWS: evitam manter definicao de cache propria e
# ja trazem o comportamento correto para conteudo estatico e para API.
data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

# O Host do viewer tem que ficar de fora: a Function URL responde pelo proprio
# hostname.
data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

# O backend expoe as rotas na raiz (/login, /users, /files/...). O prefixo /api
# existe so para o CloudFront separar API de SPA, entao e removido aqui na
# borda: /api/login -> /login; /api/files/x.jpg -> /files/x.jpg (a chave no
# bucket de imagens).
resource "aws_cloudfront_function" "api_prefix" {
  name    = "${var.project_name}-api-prefix"
  runtime = "cloudfront-js-2.0"
  comment = "Remove o prefixo /api antes das origens da API"
  publish = true

  code = <<-EOT
    function handler(event) {
      var request = event.request;
      request.uri = request.uri.replace(/^\/api(?=\/|$)/, "") || "/";
      return request;
    }
  EOT
}

# O frontend usa BrowserRouter: /login, /mentor etc. sao rotas do React, nao
# arquivos. Caminho sem extensao vira /index.html. Feito aqui, e nao com
# custom_error_response 403/404 -> index.html, porque aquilo vale para todas as
# origens e reescreveria os 404 da API como 200 com HTML.
resource "aws_cloudfront_function" "spa_fallback" {
  name    = "${var.project_name}-spa-fallback"
  runtime = "cloudfront-js-2.0"
  comment = "Rotas do React Router servem o index.html"
  publish = true

  code = <<-EOT
    function handler(event) {
      var request = event.request;
      var last = request.uri.split("/").pop();
      if (last.indexOf(".") === -1) {
        request.uri = "/index.html";
      }
      return request;
    }
  EOT
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-s3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  comment             = "${var.project_name} - SPA, API e imagens"
  price_class         = "PriceClass_100"
  default_root_object = "index.html"

  origin {
    origin_id                = "site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id                = "files"
    domain_name              = aws_s3_bucket.files.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  origin {
    origin_id = "lambda"
    # A Function URL vem como https://<id>.lambda-url.<regiao>.on.aws/ e o
    # CloudFront quer so o host.
    domain_name = replace(replace(aws_lambda_function_url.api.function_url, "https://", ""), "/", "")

    # O que substitui o OAC: so o CloudFront conhece este valor, e o handler
    # recusa qualquer requisicao que chegue sem ele.
    custom_header {
      name  = "x-origin-secret"
      value = random_password.origin_secret.result
    }

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "site"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_fallback.arn
    }
  }

  # Imagens: o frontend monta <API>/files/<nome>, entao chegam em /api/files/*.
  # Vem do bucket, e nao da Lambda; o nome e unico por upload, cache longo.
  # Declarado antes de /api/* porque a ordem decide.
  ordered_cache_behavior {
    path_pattern           = "/api/files/*"
    target_origin_id       = "files"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.api_prefix.arn
    }
  }

  # A API nao pode ser cacheada e precisa dos headers do cliente intactos
  # (Authorization: Bearer <jwt>).
  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "lambda"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.api_prefix.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Certificado *.cloudfront.net: HTTPS sem dominio proprio nem ACM.
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.project_name}-app"
  }
}
