# GitHub Actions Variables (Required)

Configure these repository variables in:
- GitHub Repository -> Settings -> Secrets and variables -> Actions -> Variables

## 1. Base Variable (Always Required)

1. `VITE_BACKEND_MODE`
- Allowed values: `local`, `api`, `supabase`

## 2. API Mode Variables

Required when `VITE_BACKEND_MODE=api`:

1. `VITE_API_BASE_URL`
- Example: `https://api.example.com`

Optional in api mode:

1. `VITE_API_ENABLED`
- Compatibility flag for legacy flow
- Recommended: `true`

2. `VITE_AUTH_ENABLED`
- Value: `true` or `false`

## 3. Supabase Mode Variables

Required when `VITE_BACKEND_MODE=supabase`:

1. `VITE_SUPABASE_URL`
- Example: `https://<project-ref>.supabase.co`

2. `VITE_SUPABASE_ANON_KEY`
- Public anon key from Supabase project settings

Optional in supabase mode:

1. `VITE_SUPABASE_GUEST_USER_ID`
- Default value is `1`
- Used for guest progress row ownership in current implementation

## 4. Recommended Initial Values (Supabase)

- `VITE_BACKEND_MODE=supabase`
- `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY=<anon-key>`
- `VITE_SUPABASE_GUEST_USER_ID=1`

## 5. Verify Configuration

After setting variables:

1. Trigger workflow [.github/workflows/docs-deploy.yml](.github/workflows/docs-deploy.yml)
2. Confirm `Validate deploy variables` step passes
3. Confirm docs build and deploy steps succeed

If validation fails, workflow logs will show which variable is missing.
