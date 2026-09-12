# PNPM workspace guide

This repository is managed as a single PNPM monorepo. The root workspace configuration keeps all packages together under one install and one lockfile, while each app/package still has its own `package.json` and scripts.

## Workspace structure

The root workspace file includes these packages:

- `frontend`
- `backend`
- `shared`
- `infra`

This means commands are generally run from the project root, and PNPM will handle the dependency graph across all packages.

## Common commands

### Install dependencies

```bash
pnpm install
```

Run this once after cloning the repo or after pulling dependency updates.

### Start the app stack

```bash
pnpm dev
```

This runs the frontend and backend together in parallel from the root workspace.

### Build everything

```bash
pnpm build
```

This runs the build script across all workspace packages.

### Run tests for the whole repo

```bash
pnpm test
```

This executes tests in every package that defines a `test` script.

### Run linting

```bash
pnpm lint
```

### Type checking

```bash
pnpm typecheck
```

### Format code

```bash
pnpm format
pnpm format:check
```

## Package-level commands

You can also target one package directly.

```bash
pnpm --filter frontend dev
pnpm --filter backend dev
pnpm --filter shared build
pnpm --filter infra deploy
```

This is useful when you want to run a command only for a specific workspace package.

## Notes

- The root `package.json` contains shared workspace scripts.
- Each package can still define its own local commands like `dev`, `build`, `test`, `lint`, and `typecheck`.
- The lockfile and install state are managed centrally at the repo root via PNPM.

In short: use the root commands for repo-wide actions, and use `--filter` when you only want to work inside one package.
