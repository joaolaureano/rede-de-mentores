# Rede de Mentores — V1 (versão original)

**[Read this in English / Leia em inglês](README.md)**

Projeto acadêmico desenvolvido na **AGES** (Agência Experimental de Engenharia
de Software) da **PUCRS**, no semestre 2020/1.

Esta é a versão original do projeto, mantida como arquivo. A versão atual está
na branch `main`.

## O que é

Uma plataforma que conecta **mentores** e **alunos** (mentorados) interessados
em áreas de conhecimento ou no desenvolvimento de seus projetos.

- Mentores se cadastram, informam suas áreas e publicam mentorias com dias e
  horários disponíveis.
- Um administrador aprova (ou rejeita) cada mentoria antes de ela ficar visível.
- Alunos navegam pelas áreas, escolhem uma mentoria e reservam um horário,
  presencial ou online.

## Stack

- **Frontend:** React (Create React App), Material-UI, styled-components, Storybook
- **Backend:** Node.js + Express, autenticação JWT
- **Banco:** Firebase (Firestore)
- **E-mail:** Nodemailer (Gmail SMTP)

## Estrutura

- `backend/` — API REST
- `frontend/` — aplicação web

## Documentação

Wiki do projeto (requisitos, arquitetura, sprints, time):
https://tools.ages.pucrs.br/rede-de-mentores/wiki/-/wikis/home

## Observação

Os valores de configuração (chaves, credenciais) e as imagens enviadas por
usuários foram removidos desta versão arquivada.
