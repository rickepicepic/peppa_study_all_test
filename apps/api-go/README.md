# api-go

Go backend for the network learning platform M2.

## Quick Start

1. Start MySQL (Docker):

```bash
make compose-up
```

2. Run API:

```bash
make dev
```

When `MYSQL_DSN` is set and reachable, API uses MySQL repositories.
Otherwise it falls back to in-memory repositories (suitable for local quick checks).

Set `CORS_ALLOW_ORIGINS` to your GitHub Pages domain in production, for example:

```bash
CORS_ALLOW_ORIGINS=https://<username>.github.io
```

3. Run tests:

```bash
make test
```

## Auth Toggle

Set `AUTH_ENABLED=true` to require bearer token on protected endpoints.

- `POST /api/v1/auth/login` returns JWT for local testing.
- `POST /api/v1/progress/sync` and `POST /api/v1/quizzes/submit` are protected when auth is enabled.

## Integration Test with MySQL

Set `TEST_MYSQL_DSN` before running tests to execute migration table assertions:

```bash
export TEST_MYSQL_DSN='root:root@tcp(127.0.0.1:3306)/nfp?parseTime=true&multiStatements=true'
go test ./tests/integration -v
```

If `TEST_MYSQL_DSN` is not set, DB-dependent integration tests are skipped.

## One-command Smoke Test

Run a full local smoke test (mysql up, migrations, api startup, endpoint checks, db persistence checks):

```bash
make smoke
```

## Production Templates

- systemd service template: `deploy/systemd/nlp-api.service`
- Nginx reverse proxy template: `deploy/nginx/api.conf`
- cloud operations guide: `../../docs/deployment/cloud-server-operations.md`
