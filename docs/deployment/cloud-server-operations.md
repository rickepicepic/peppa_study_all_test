# Cloud Server Operations Guide

This guide focuses on production operation steps after code is ready.

## 1. Server Prerequisites

1. Ubuntu 22.04+ (or equivalent)
2. Go 1.24+
3. MySQL 8+
4. Nginx
5. A domain that points to the server (example: api.example.com)

## 2. Directory Layout

Recommended layout:

```bash
/opt/network-learning-platform/
  apps/api-go/
  packages/
  apps/docs/
```

## 3. Environment File

Create environment file at:

```bash
/etc/nlp/api-go.env
```

Example content:

```bash
API_HTTP_ADDR=:8080
AUTH_ENABLED=false
JWT_SECRET=<replace-with-strong-secret>
MYSQL_DSN=<user>:<password>@tcp(127.0.0.1:3306)/nlp?parseTime=true&multiStatements=true
CORS_ALLOW_ORIGINS=https://<username>.github.io
```

## 4. Install and Enable systemd Service

Copy service template:

```bash
sudo cp /opt/network-learning-platform/apps/api-go/deploy/systemd/nlp-api.service /etc/systemd/system/nlp-api.service
```

Reload and enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nlp-api
sudo systemctl restart nlp-api
sudo systemctl status nlp-api --no-pager
```

View logs:

```bash
journalctl -u nlp-api -f
```

## 5. Configure Nginx Reverse Proxy

Copy template:

```bash
sudo cp /opt/network-learning-platform/apps/api-go/deploy/nginx/api.conf /etc/nginx/sites-available/nlp-api.conf
```

Edit server_name and apply:

```bash
sudo ln -sf /etc/nginx/sites-available/nlp-api.conf /etc/nginx/sites-enabled/nlp-api.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Enable HTTPS

Use certbot with Nginx plugin:

```bash
sudo certbot --nginx -d api.example.com
```

After cert issue, verify:

```bash
curl -I https://api.example.com/healthz
```

## 7. Rollout Validation

1. Service is active:

```bash
sudo systemctl is-active nlp-api
```

2. API mode check:

```bash
curl -s https://api.example.com/healthz
```

Expected contains `"storageMode":"mysql"`.

3. End-to-end smoke:

```bash
cd /opt/network-learning-platform/apps/api-go
make smoke
```

## 8. Safe Rollback

1. Keep previous release under timestamp folder.
2. Switch symlink back to previous release.
3. Restart service:

```bash
sudo systemctl restart nlp-api
```

4. Verify health endpoint and logs.

## 9. Operational Minimum

1. Daily MySQL backup and retention policy.
2. Alert when `/healthz` fails.
3. Alert when service restarts frequently.
4. Rotate `JWT_SECRET` through maintenance windows.
