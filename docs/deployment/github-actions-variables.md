# GitHub Actions Variables (Required)

Configure these repository variables in:
- GitHub Repository -> Settings -> Secrets and variables -> Actions -> Variables

## Required Variables

1. `VITE_API_ENABLED`
- Value: `true` (production API mode) or `false` (local-only mode)

2. `VITE_API_BASE_URL`
- Required when `VITE_API_ENABLED=true`
- Example: `https://api.example.com`

3. `VITE_AUTH_ENABLED`
- Value: `true` or `false`
- Use `false` if login/auth is not enabled in production yet

## Recommended Initial Values

- `VITE_API_ENABLED=true`
- `VITE_API_BASE_URL=https://api.your-domain.com`
- `VITE_AUTH_ENABLED=false`

## Verify Configuration

After setting variables:

1. Trigger workflow [network-learning-platform/.github/workflows/docs-deploy.yml](network-learning-platform/.github/workflows/docs-deploy.yml)
2. Confirm `Validate deploy variables` step passes
3. Confirm docs build and deploy steps succeed

If validation fails, workflow logs will show which variable is missing.
