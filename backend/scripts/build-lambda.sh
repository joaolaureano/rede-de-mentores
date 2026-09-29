#!/bin/bash
# Gera dist-lambda/lambda.zip, o pacote que a infraestrutura publica
# (lambda_package no Terraform). Um zip, duas funcoes: a API (handler
# "lambda.handler") e o resize das imagens (handler "resizer.handler").
#
# 1. sucrase: o codigo mistura `import` com `module.exports`, o que o sucrase
#    aceita (e o que roda localmente) mas o esbuild nao - entao vira CommonJS
#    antes.
# 2. esbuild: um arquivo por funcao. O @aws-sdk vai junto (o
#    s3-presigned-post nao tem garantia de estar no runtime, e misturar versoes
#    do runtime com as empacotadas e pior); so o sharp fica de fora, porque tem
#    binario nativo.
# 3. sharp instalado com os binarios de Linux arm64 (a arquitetura da Lambda),
#    e nao os da maquina que builda.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist-lambda"
TMP="$OUT/tmp"
PKG="$OUT/pkg"

rm -rf "$OUT"
mkdir -p "$TMP" "$PKG"

cd "$ROOT"

npx sucrase ./src -d "$TMP/src" --transforms imports >/dev/null

npx esbuild "$TMP/src/lambda.js" "$TMP/src/resizer.js" \
  --bundle \
  --platform=node \
  --target=node22 \
  --format=cjs \
  --external:sharp \
  --outdir="$PKG" \
  --log-level=warning

SHARP_VERSION="$(node -p "require('./node_modules/sharp/package.json').version")"
cat > "$PKG/package.json" <<EOF
{ "private": true, "dependencies": { "sharp": "$SHARP_VERSION" } }
EOF

(cd "$PKG" && npm install --omit=dev --no-audit --no-fund --no-package-lock \
  --os=linux --cpu=arm64 --libc=glibc >/dev/null)

(cd "$PKG" && zip -qr "$OUT/lambda.zip" .)
rm -rf "$TMP"

echo "pacote: $OUT/lambda.zip ($(du -h "$OUT/lambda.zip" | cut -f1))"
