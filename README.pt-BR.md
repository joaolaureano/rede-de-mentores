# Rede de Mentores

**[Read this in English / Leia em inglês](README.en.md)**

Projeto acadêmico desenvolvido na **AGES** (Agência Experimental de Engenharia
de Software) da **PUCRS**, no semestre 2020/1, e revisitado depois como projeto
de portfólio.

A versão original está preservada na branch/tag `v1`. Wiki do projeto original:
https://tools.ages.pucrs.br/rede-de-mentores/wiki/-/wikis/home

## O que é

Uma plataforma que conecta **mentores** e **alunos** (mentorados).

- Mentores se cadastram, informam suas áreas e publicam mentorias com dias e
  horários disponíveis.
- Um administrador aprova (ou rejeita) cada mentoria antes de ela ficar visível.
- Alunos navegam pelas áreas, escolhem uma mentoria e reservam um horário,
  presencial ou online.

## O que mudou em relação à V1

- **Banco:** Firebase (Firestore) → **PostgreSQL no Neon**. A camada de dados
  virou repositórios (`backend/src/repositories`) e as respostas da API ao
  frontend continuaram as mesmas.
- **Hospedagem:** Heroku → **AWS**, com custo mínimo e provisionada por
  **Terraform** (`backend/terraform`): CloudFront servindo o frontend (S3) e a
  API (Lambda), segredos no SSM Parameter Store.
- **Imagens (claim check):** a imagem não passa mais pela API. O navegador pede
  um ticket, envia o arquivo direto ao S3 e a API recebe só a referência; uma
  Lambda separada redimensiona a imagem de forma assíncrona.
- **Correções:** o hash da senha não é mais devolvido pela API, um usuário não
  consegue mais se promover a administrador, a senha não é apagada ao editar o
  perfil sem trocá-la, e outros erros pontuais da V1.
- **Dados de demonstração:** um seed (`npm run seed`) popula áreas, mentores,
  mentorados e mentorias, para o app já estar pronto para uso.
- **E-mail:** o envio está desligado por padrão (`EMAIL_ENABLED=false`).

## Estrutura

- `frontend/` — React (Create React App)
- `backend/` — API Node.js + Express
  - `db/schema.sql` — schema do Postgres
  - `scripts/` — migração, seed, criação de admin e build da Lambda
  - `terraform/` — infraestrutura AWS

## Rodando localmente

```sh
cd backend
cp .env.example .env    # ajuste DB_URL para um Postgres local ou o Neon
npm install
npm run migrate
npm run seed
npm start

cd ../frontend
npm install
npm start
```

## Deploy

```sh
cd backend
npm run build:lambda
cd terraform
cp terraform.tfvars.example terraform.tfvars   # connection string do Neon
tofu init && tofu apply
./scripts/deploy-frontend.sh
```
