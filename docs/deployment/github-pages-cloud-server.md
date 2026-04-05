# GitHub Pages + Cloud Server Deployment Guide

This runbook covers production deployment for:
- Frontend: GitHub Pages
- Backend API: cloud server (Go)
- Database: MySQL (cloud server)

## 1. Remaining Tasks to Reach Production

1. Infrastructure and domain
- Prepare API domain (recommended: api.your-domain.com)
- Issue TLS certificate (Let's Encrypt / cloud provider)
- Open required ports and configure firewall

2. Backend production runtime
- Run api-go as a managed service (systemd or container)
- Configure production env vars (`MYSQL_DSN`, `CORS_ALLOW_ORIGINS`, `JWT_SECRET`)
- Ensure DB migrations run before first traffic

3. Frontend production config
- Set GitHub repository variables used by docs workflow:
  - `VITE_API_ENABLED=true`
  - `VITE_API_BASE_URL=https://api.your-domain.com`
  - `VITE_AUTH_ENABLED=false` (or true when auth is enabled)

4. Operational readiness
- Add DB backup schedule
- Add basic API monitoring and health checks
- Add alerting for service down and high error rate

## 2. Backend Cloud Server Setup

## 2.1 Prepare environment

Install Go 1.24+, MySQL 8, and required tools.

Create environment file (example):

```bash
API_HTTP_ADDR=:8080
AUTH_ENABLED=false
JWT_SECRET=<strong-random-secret>
MYSQL_DSN=<user>:<password>@tcp(127.0.0.1:3306)/nlp?parseTime=true&multiStatements=true
CORS_ALLOW_ORIGINS=https://<username>.github.io
```

## 2.2 Initialize database

Use migration files under `apps/api-go/db/migrations`.

For first-time setup, run in order:
- `000001_init_schema.up.sql`
- `000002_seed_subject.up.sql`

## 2.3 Start backend

From `network-learning-platform/apps/api-go`:

```bash
go run ./cmd/server
```

Verify:

- `GET /healthz` should return `storageMode=mysql`

## 3. Frontend GitHub Pages Setup

## 3.1 Enable Pages

In GitHub repository settings:
- Pages -> Build and deployment -> GitHub Actions

## 3.2 Set repository variables

In GitHub repository settings -> Secrets and variables -> Actions -> Variables:

- `VITE_API_ENABLED=true`
- `VITE_API_BASE_URL=https://api.your-domain.com`
- `VITE_AUTH_ENABLED=false`

Detailed variable setup guide:
- [network-learning-platform/docs/deployment/github-actions-variables.md](network-learning-platform/docs/deployment/github-actions-variables.md)

The workflow [network-learning-platform/.github/workflows/docs-deploy.yml](network-learning-platform/.github/workflows/docs-deploy.yml) already injects these values at build time.

## 3.3 Deploy

Push to `main` (or trigger workflow manually) and verify the generated Pages URL.

## 4. End-to-End Validation

From `apps/api-go`, run:

```bash
make smoke
```

This validates:
- mysql container up and healthy
- migrations applied
- api starts in mysql mode
- progress sync and quiz submit endpoints work
- key persistence rows exist in DB

## 5. Go-Live Checklist

1. `GET /healthz` returns status ok and `storageMode=mysql`
2. GitHub Pages frontend can call API successfully (no CORS errors)
3. `make smoke` passes in staging/prod-like environment
4. MySQL backups tested (restore drill at least once)
5. JWT secret rotated from default and stored securely
6. Monitoring/alerts active for API and DB
