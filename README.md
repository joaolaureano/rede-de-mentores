# Rede de Mentores — V1 (original version)

**[Leia em português / Read this in Portuguese](README.pt-BR.md)**

Academic project built at **AGES** (Agência Experimental de Engenharia de
Software, PUCRS's experimental software engineering agency) in the 2020/1
semester.

This is the original version of the project, kept as an archive. The current
version is on the `main` branch.

## What it is

A platform that connects **mentors** and **students** (mentees) interested in
knowledge areas or in developing their projects.

- Mentors sign up, list their areas and publish mentorships with available days
  and times.
- An administrator approves (or rejects) each mentorship before it becomes
  visible.
- Students browse the areas, pick a mentorship and book a time slot, in person
  or online.

## Stack

- **Frontend:** React (Create React App), Material-UI, styled-components, Storybook
- **Backend:** Node.js + Express, JWT authentication
- **Database:** Firebase (Firestore)
- **E-mail:** Nodemailer (Gmail SMTP)

## Structure

- `backend/` — REST API
- `frontend/` — web application

## Documentation

Project wiki (requirements, architecture, sprints, team):
https://tools.ages.pucrs.br/rede-de-mentores/wiki/-/wikis/home

## Note

Configuration values (keys, credentials) and images uploaded by users were
removed from this archived version.
