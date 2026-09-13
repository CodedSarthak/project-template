# Project Template

This repository is a reusable monorepo starter for building a full-stack product with:

- React + Vite + TypeScript + Tailwind for the frontend
- Express + TypeScript + Prisma for the backend
- PostgreSQL as the primary database
- AWS CDK for infrastructure deployment
- S3 + CloudFront for frontend hosting
- Lambda + API Gateway for backend hosting
- PNPM workspaces for package management

It is designed to be cloned and adapted for a new project without rebuilding the entire foundation from scratch.

## Monorepo structure

- `frontend/` — React application
- `backend/` — Express API and Prisma setup
- `shared/` — cross-package shared types, utilities, and contracts
- `infra/` — AWS CDK stacks for deployment
- `docs/` — architecture and engineering notes

## Quick start

1. Install dependencies

```bash
pnpm install
```

2. Run the app locally

```bash
pnpm dev
```

This starts the frontend and backend in parallel.

3. Build for production

```bash
pnpm build
```

4. Typecheck

```bash
pnpm typecheck
```

## Project naming convention

This template uses a single placeholder project slug: `projectName`.

When creating a real app from this template, replace the placeholder consistently across the repo:

- root package name
- workspace package names
- AWS resource names
- Secrets Manager secret names
- API names

## AWS deployment model

The template is structured around:

- Frontend: S3 + CloudFront
- Backend: Lambda + API Gateway
- Database: PostgreSQL via Prisma and Supabase / managed Postgres
- Secrets: AWS Secrets Manager

The backend uses a production-safe environment contract and reads secrets through the CDK configuration rather than hardcoding values.

## How to create a new project from this template

1. Git clone this repository, and run these commands : `pnpm install`, `pnpm typecheck`.
2. Rename the root package name and all workspace package names to your project slug. Replace `projectName` in the entire repository.
3. In pipeline.yml, we are using `AWS_DEPLOY_ROLE_ARN` to deploy the infra to AWS. So setup that role in AWS, and then add that to Github Secrets.
4. Replace the sample Prisma schema with your real database model.
5. Add your application logic inside `frontend` and `backend`.
6. Add environment variables in `.env` fil
   es or your deployment platform.
7. Run the repo and deploy via the CDK pipeline.
