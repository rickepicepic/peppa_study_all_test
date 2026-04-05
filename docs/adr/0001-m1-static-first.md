# ADR 0001: M1 static-first architecture

- Status: accepted
- Date: 2026-04-05

## Context

M1 must ship a usable learning site quickly with low operational overhead.
The project needs dual-track content delivery, static search, a local quiz loop,
and guest progress storage. A backend service is planned for M2, so coupling M1
to server-side login or sync would increase delivery risk.

## Decision

Use a static-first architecture for M1.

- Build docs with VitePress from Markdown content.
- Publish the generated static site to GitHub Pages.
- Keep quiz scoring and progress persistence on the client side.
- Run CI quality gates (install, test, build) on Node.js 22 with pnpm.

## Consequences

Positive:

- Fast delivery and low hosting cost.
- Simple and reliable deployment flow.
- Clear isolation between M1 and M2 responsibilities.

Trade-offs:

- No account-based sync in M1.
- Progress data is device-local and can be cleared by users.
- Cross-device continuity depends on M2 rollout.

## Follow-up

M2 should introduce backend APIs and database-backed progress sync without
breaking M1 content URLs and frontmatter schema contracts.
