# Supabase Backend Migration Plan (2026-04-05)

## Context Summary

The project has completed:

1. M1 static-first docs and quiz loop on GitHub Pages.
2. M2 self-hosted Go + MySQL backend path with sync bridge and smoke checks.
3. Repository separation from superpowers and independent GitHub repository setup.

New decision:

- Replace planned default backend path with Supabase.
- Keep self-hosted Go/MySQL as fallback option.

## Goal

Switch production default from `api` mode to `supabase` mode while preserving local-only and api fallback compatibility.

## Execution Scope

Included:

1. Frontend sync bridge support for Supabase progress write.
2. GitHub Actions deploy variable validation for multi-backend mode.
3. Deployment and variable documentation updates.
4. Supabase table and RLS policy checklist.

Not included:

1. Full auth migration to Supabase Auth.
2. Complete replacement of historical Go API endpoints.
3. Analytics and admin workflows.

## Task Breakdown

### Task 1: Backend Mode Switch Capability

- Add `VITE_BACKEND_MODE` (`local` | `api` | `supabase`).
- Keep backward compatibility with existing `VITE_API_ENABLED` behavior.
- Introduce Supabase client path for progress sync.

Verification:

- Docs build succeeds in local mode.
- Docs build succeeds in supabase mode when required variables are provided.

### Task 2: Supabase Sync Contract

- Current sync writes to table: `user_progress`.
- Required columns:
  - `user_id`
  - `subject`
  - `node_id`
  - `completed`
  - `updated_at`
- Required unique key:
  - `(user_id, subject, node_id)`

Verification:

- Quiz submit triggers cloud sync status without runtime errors.
- Row upsert appears in Supabase table.

### Task 3: Deployment Variables and Workflow

- Validate variables by backend mode.
- `supabase` mode must require:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- `api` mode must require:
  - `VITE_API_BASE_URL`

Verification:

- `docs-deploy` workflow passes validation step in selected mode.

### Task 4: Rollout Plan

Stage A (immediate):

1. Set `VITE_BACKEND_MODE=supabase`.
2. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Keep `VITE_API_ENABLED=false` to avoid confusion.

Stage B (stabilization):

1. Add stricter RLS policies.
2. Evaluate replacing guest user id strategy with authenticated user mapping.

## Risks and Mitigations

1. Risk: direct anon key write can be over-permissive.
- Mitigation: apply minimal RLS policy and move writes to Edge Functions in next phase.

2. Risk: schema mismatch between frontend and Supabase table.
- Mitigation: enforce table contract and unique key before rollout.

3. Risk: mixed configuration confusion (`api` and `supabase`).
- Mitigation: use single source switch `VITE_BACKEND_MODE` and mode-based workflow checks.
