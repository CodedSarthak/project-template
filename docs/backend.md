# Backend practices

This backend follows a TypeScript-first, Express-based service setup inside the PNPM monorepo. The goal is to keep the API simple, predictable, and consistent across all routes and handlers.

## Stack

- Language: TypeScript
- Runtime: Node.js
- Framework: Express
- Module system: ES modules (`"type": "module"`)
- TypeScript target: NodeNext-compatible setup
- ORM: Prisma
- Database: PostgreSQL
- Database hosting: Supabase
- Validation: Zod
- Testing: Vitest
- Development runtime: `tsx` for hot reloading

## Project structure

The backend package is organized around a small layered structure:

- `src/server.ts` - starts the HTTP server
- `src/app.ts` - configures Express app and routes
- `src/middlewares/error.middleware.ts` - centralized error handling
- `src/utils/asyncHandler.ts` - wrapper for async request handlers
- `src/handlers/` - route-specific handlers
- `prisma/` - Prisma schema, migrations, and generated client configuration

This keeps the codebase readable and encourages separation between request handling, business logic, and error flow.

## Async handling pattern

All route handlers should be async-safe. We use an `asyncHandler` wrapper so promise rejections are caught and forwarded to the global error middleware instead of crashing the process.

This is used to wrap route handlers before registering them with Express.

## Error handling

We use a centralized error middleware to respond consistently to unexpected failures.

## Database access

The backend uses Prisma as the ORM layer and PostgreSQL as the relational database. The production database is hosted in Supabase, while the application code interacts with Prisma for migrations, queries, models, and transactions.

This means the general pattern is:

- Prisma schema defines the database model
- Prisma client is used in service or handler logic
- query logic stays separated from HTTP controller code
- database access is abstracted so route handlers remain thin

Typical conventions:

- keep Prisma client usage in service-layer or repository-style modules
- never put raw database logic directly inside route handlers
- use async patterns consistently when waiting on DB operations
- handle Prisma errors through the central error middleware

## Validation

Request validation should be done before business logic is processed. Zod is used to validate request payloads and parameters when needed.

Typical practices:

- validate request bodies
- validate query params and route params
- fail fast with clear validation errors
- return structured error responses

## Response conventions

Responses should be consistent and explicit:

- use HTTP status codes intentionally
- return JSON responses for API endpoints
- use predictable field names for errors
- avoid leaking raw internal exceptions to clients

## Structure conventions

The backend uses a small, maintainable structure:

- `middlewares/` for reusable Express middleware
- `utils/` for shared helper functions
- `server.ts` for bootstrapping the app

