# Rede de Mentores

**[Leia em português / Read this in Portuguese](README.pt-BR.md)**

Academic project built at **AGES** (Agência Experimental de Engenharia de
Software, PUCRS's experimental software engineering agency) in the 2020/1
semester, and revisited later as a portfolio project.

The original version is preserved in the `v1` branch/tag. Wiki of the original
project:
https://tools.ages.pucrs.br/rede-de-mentores/wiki/-/wikis/home

## What it is

A platform that connects **mentors** and **students** (mentees).

- Mentors sign up, list their areas and publish mentorships with available days
  and times.
- An administrator approves (or rejects) each mentorship before it becomes
  visible.
- Students browse the areas, pick a mentorship and book a time slot, in person
  or online.

## What changed since V1

- **Database:** Firebase (Firestore) → **PostgreSQL on Neon**. The data layer
  became repositories (`backend/src/repositories`) and the API responses to the
  frontend stayed the same.
- **Hosting:** Heroku → **AWS**, at minimal cost and provisioned with
  **Terraform** (`backend/terraform`): CloudFront serving the frontend (S3) and
  the API (Lambda), secrets in SSM Parameter Store.
- **Images (claim check):** the image no longer goes through the API. The
  browser asks for a ticket, uploads the file straight to S3 and the API only
  receives the reference; a separate Lambda resizes the image asynchronously.
- **Fixes:** the password hash is no longer returned by the API, a user can no
  longer promote themselves to administrator, the password is no longer wiped
  when editing the profile without changing it, and other small V1 bugs.
- **Demo data:** a seed (`npm run seed`) populates areas, mentors, mentees and
  mentorships, so the app is ready to use.
- **E-mail:** sending is off by default (`EMAIL_ENABLED=false`).

## Structure

- `frontend/` — React (Create React App)
- `backend/` — Node.js + Express API
  - `db/schema.sql` — Postgres schema
  - `scripts/` — migration, seed, admin creation and Lambda build
  - `terraform/` — AWS infrastructure

## Running locally

```sh
cd backend
cp .env.example .env    # set DB_URL to a local Postgres or to Neon
npm install
npm run migrate
npm run seed
npm start

cd ../frontend
npm install
npm start
```

## Deployment

```sh
cd backend
npm run build:lambda
cd terraform
cp terraform.tfvars.example terraform.tfvars   # Neon connection string
tofu init && tofu apply
./scripts/deploy-frontend.sh
```
