# Rede de Mentores Frontend

Esse projeto é o frontend do projeto Rede de mentores

# temos que terminar o README.md
# Deploy da aplicação

O deploy é feito na AWS (S3 + CloudFront) pelo script
`backend/terraform/scripts/deploy-frontend.sh`, que builda o SPA com a API em
`/api` e publica no bucket. A URL pública sai em `tofu output app_url`, dentro de
`backend/terraform`.
