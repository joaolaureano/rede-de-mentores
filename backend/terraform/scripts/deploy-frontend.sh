#!/bin/bash
# Builda o SPA apontando a API para /api (mesmo dominio, atras do CloudFront -
# sem CORS), publica no bucket privado e invalida o index no CloudFront.
# O frontend le a base da API de REACT_APP_API_URL (src/services/http.js) e
# monta as imagens em <API>/files/<nome>, que o CloudFront serve do bucket.
set -euo pipefail

TF_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$TF_DIR/../.." && pwd)"
BUILD="$REPO_ROOT/frontend/build"

bucket="$(tofu -chdir="$TF_DIR" output -raw site_bucket)"
distribution="$(tofu -chdir="$TF_DIR" output -raw distribution_id)"

# react-scripts 3 (webpack 4) usa um hash que o OpenSSL 3 do Node >= 17 recusa
(cd "$REPO_ROOT/frontend" && npm ci && \
  REACT_APP_API_URL=/api NODE_OPTIONS=--openssl-legacy-provider npm run build)

# Os arquivos de build/static levam hash no nome, entao podem ficar em cache
# para sempre. O resto (index.html, manifest, service worker) nao: no-cache, ou
# o navegador seguraria um index velho apontando para assets que o --delete ja
# removeu.
aws s3 sync "$BUILD/static" "s3://$bucket/static" --delete \
  --cache-control "public,max-age=31536000,immutable"
aws s3 sync "$BUILD" "s3://$bucket" --delete --exclude "static/*" \
  --cache-control "no-cache"

aws cloudfront create-invalidation --distribution-id "$distribution" \
  --paths "/*" >/dev/null

echo "publicado: $(tofu -chdir="$TF_DIR" output -raw app_url)"
