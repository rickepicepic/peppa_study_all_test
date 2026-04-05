# GitHub Pages + Supabase Deployment Guide

This runbook covers production deployment for:
- Frontend: GitHub Pages
- Backend data layer: Supabase (Postgres + REST)
- Optional fallback: self-hosted Go API + MySQL

## 1. Remaining Tasks to Reach Production

1. Supabase project setup
- Create project and choose region
- Create `user_progress` table (or use existing schema)
- Configure row-level security policies for guest write strategy

2. Frontend production config
- Set GitHub repository variables used by docs workflow:
  - `VITE_BACKEND_MODE=supabase`
  - `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<anon-key>`
  - `VITE_SUPABASE_GUEST_USER_ID=1` (optional, defaults to 1)

3. Operational readiness
- Add backup/export policy in Supabase
- Add API request monitoring and alerting
- Confirm CORS origin policy includes your GitHub Pages origin

## 2. Supabase Setup

## 2.1 Required Table

Current frontend sync implementation writes into `user_progress` with columns:

- `user_id` (bigint)
- `subject` (text)
- `node_id` (text)
- `completed` (boolean)
- `updated_at` (timestamptz)

And expects unique constraint on:

- `(user_id, subject, node_id)`

## 2.2 RLS Policy Notes

Because the frontend currently uses anon key directly, you need policies that allow:

1. upsert for the guest user id
2. read/write only within allowed guest scope

If you prefer stricter security, move write logic into Supabase Edge Functions and keep anon key permissions minimal.

## 3. Frontend GitHub Pages Setup

## 3.1 Enable Pages

In GitHub repository settings:
- Pages -> Build and deployment -> GitHub Actions

## 3.2 Set repository variables

In GitHub repository settings -> Secrets and variables -> Actions -> Variables:

- `VITE_BACKEND_MODE=supabase`
- `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<anon-key>`
- `VITE_SUPABASE_GUEST_USER_ID=1`

Detailed variable setup guide:
- [docs/deployment/github-actions-variables.md](docs/deployment/github-actions-variables.md)

The workflow [.github/workflows/docs-deploy.yml](.github/workflows/docs-deploy.yml) validates and injects these values at build time.

## 3.3 Deploy

Push to `main` (or trigger workflow manually) and verify the generated Pages URL.

## 4. End-to-End Validation

1. Open one learning page with quiz panel
2. Submit quiz once
3. Confirm browser has no sync error
4. Verify `user_progress` got updated in Supabase table

## 5. Legacy Self-hosted API Option

If you need to keep Go API path:

1. Set `VITE_BACKEND_MODE=api`
2. Set `VITE_API_BASE_URL=https://api.your-domain.com`
3. Keep running `apps/api-go` service and MySQL
