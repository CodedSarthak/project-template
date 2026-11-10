# Full-Stack Monorepo Application Template

A clean, production-ready monorepo template engineered to minimize configuration overhead and boilerplate so that after cloning, you can focus purely on writing your application's business code.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma ORM (v7), PostgreSQL, Serverless HTTP / AWS Lambda ready, AWS SDK v3 (S3 pre-signed storage).
- **Frontend**: React 19, Vite, Tailwind CSS v4, custom semantic design token system, reusable UI components.
- **Shared**: Monorepo workspace package (`@project-template/shared`) with shared contracts, Zod schemas, TypeScript types, and standardized API response envelopes.
- **Infra**: AWS CDK for backend and frontend cloud deployment.
- **Tooling**: pnpm workspaces, unified flat ESLint, TypeScript strict mode.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x
- PostgreSQL database (local or cloud)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url> my-app
cd my-app

# Install all workspace dependencies
pnpm install
```

### 3. Environment Configuration
Copy `.env.example` in `backend/` and configure your credentials:
```bash
cp backend/.env.example backend/.env
```
Ensure your `DATABASE_URL` and `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` are populated.

### 4. Database Setup
```bash
# Generate Prisma Client
pnpm prisma:generate:app

# Push database schema or run dev migrations
pnpm prisma:migrate:app
```

### 5. Start Development
```bash
# Starts both Backend (port 3000) and Frontend (port 5173) concurrently
pnpm dev
```
- **Backend API**: `http://localhost:3000`
- **Frontend App**: `http://localhost:5173` (with `/api` dev proxy to port 3000)

---

## ❓ Why is `prisma.config.ts` Needed?

You are using **Prisma v7 (`^7.10.1`)**, which introduced a major architectural change:

1. **`url` is no longer supported in `schema.prisma`**:
   In Prisma 7, placing `url = env("DATABASE_URL")` directly inside `schema.prisma` throws a validation error:
   ```
   error: The datasource property `url` is no longer supported in schema files.
   ```
2. **Runtime Driver Adapters**:
   At application runtime, Prisma 7 uses driver adapters (`@prisma/adapter-pg` with `pg.Pool`), configured in `src/config/prisma.ts`.
3. **Prisma CLI Tooling**:
   CLI commands (`prisma migrate dev`, `prisma db push`, `prisma studio`) do not run your application code. Instead, Prisma 7 reads the database connection string directly from **`prisma.config.ts`**:
   ```ts
   import 'dotenv/config';

   export default {
     datasource: {
       url: process.env.DATABASE_URL,
     },
   };
   ```

---

## 📐 Standardized API Conventions

When writing your business routes, follow this standardized HTTP status and response contract:

### Status Code & Response Matrix

| Scenario | HTTP Status | Response Contract | Express Pattern |
| :--- | :--- | :--- | :--- |
| **Successful GET / Read** | `200 OK` | `ApiSuccessResponse<T>` | `res.status(200).json({ success: true, data })` |
| **Resource Created** | `201 Created` | `ApiSuccessResponse<T>` | `res.status(201).json({ success: true, data })` |
| **Successful Deletion / Action** | `204 No Content` | *Empty body (no content)* | `res.status(204).send()` |
| **Validation Failure** | `400 Bad Request` | `ApiErrorResponse` | Automatic via `schema.parse()` |
| **Unauthenticated** | `401 Unauthorized` | `ApiErrorResponse` | Automatic via `authenticateToken` |
| **Unauthorized / Forbidden** | `403 Forbidden` | `ApiErrorResponse` | `throw new ForbiddenException()` |
| **Resource Not Found** | `404 Not Found` | `ApiErrorResponse` | `throw new NotFoundException()` |
| **Conflict (e.g. Duplicate Key)** | `409 Conflict` | `ApiErrorResponse` | `throw new ConflictException()` |
| **Server Error** | `500 Internal Error` | `ApiErrorResponse` | Handled by `errorHandler` |

> **Key Rule**: A `204 No Content` response **never** returns a JSON body. Always use `res.status(204).send()`.

---

## 🔒 Stable Error Codes

All errors return a typed machine-readable `code`:

```ts
export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: ApiErrorDetail[];
}
```

Pre-configured error codes in `@project-template/shared`:
- `VALIDATION_ERROR` (400)
- `BAD_REQUEST` (400)
- `UNAUTHENTICATED` (401)
- `UNAUTHORIZED` / `FORBIDDEN` (403)
- `RESOURCE_NOT_FOUND` (404)
- `CONFLICT` (409)
- `TOO_MANY_REQUESTS` (429)
- `INTERNAL_SERVER_ERROR` (500)

### Security: Internal Server Error Protection
The centralized error middleware catches uncaught exceptions, logs the full stack trace to server logs, and returns a safe, sanitized client response:
```json
{
  "success": false,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected internal server error occurred"
}
```
**Internal stack traces and database errors are never exposed to clients.**

---

## 💻 Writing Your Business Code

### 1. Defining a Model
In `backend/prisma/schema.prisma`:
```prisma
model Item {
  id        String   @id @default(cuid())
  title     String
  createdAt DateTime @default(now())
}
```
Run `pnpm prisma:migrate:app` to apply changes.

### 2. Defining a Shared Contract
In `shared/src/contracts/item.ts`:
```ts
import { z } from 'zod';

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
```

### 3. Adding an Express Route
In `backend/src/app.ts`:
```ts
import { asyncHandler } from './utils/asyncHandler.js';
import { prisma } from './config/prisma.js';
import { createItemSchema } from '@project-template/shared';

// Create (201 Created)
app.post('/api/items', asyncHandler(async (req, res) => {
  const input = createItemSchema.parse(req.body);
  const item = await prisma.item.create({ data: input });
  return res.status(201).json({ success: true, data: item });
}));

// Delete (204 No Content)
app.delete('/api/items/:id', asyncHandler(async (req, res) => {
  await prisma.item.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}));
```

---

## 🗂 Monorepo Directory Structure

```
project-template/
├── backend/                # Express API application
│   ├── prisma/             # Prisma schema & migrations
│   ├── prisma.config.ts    # Prisma 7 CLI configuration
│   ├── src/
│   │   ├── config/         # Environment, DB pool, and S3 client config
│   │   ├── errors/         # Typed AppError & HTTP exceptions
│   │   ├── middleware/     # Auth and error handling middleware
│   │   ├── utils/          # JWT, asyncHandler, S3 file utils
│   │   ├── app.ts          # Clean Express application setup (Add routes here)
│   │   ├── server.ts       # Local / standalone server entry
│   │   └── handler.ts      # Serverless HTTP / AWS Lambda entry
│   └── package.json
├── frontend/               # Vite + React 19 + Tailwind v4 application
│   ├── src/
│   │   ├── auth/           # AuthService, AuthProvider context, ProtectedRoute
│   │   ├── components/     # Navbar, Sidebar, UserModal, ConfirmDelete, WelcomeScreen
│   │   ├── styles/         # Design tokens and Tailwind CSS integration
│   │   └── App.tsx         # Clean starter dashboard shell
│   └── package.json
├── shared/                 # Shared contracts workspace package
│   ├── src/
│   │   ├── contracts/      # API envelopes, ErrorCodes, Auth schemas
│   │   └── index.ts
│   └── package.json
├── infra/                  # AWS CDK Infrastructure stacks
│   ├── bin/infra.ts        # CDK application entry point
│   ├── lib/
│   │   ├── backend-stack.ts
│   │   └── frontend-stack.ts
│   └── package.json
├── package.json            # Root workspace scripts & orchestration
├── pnpm-workspace.yaml     # Workspace package definitions
└── eslint.config.mjs       # Unified flat ESLint configuration
```

---

## 🧪 Verification Commands

```bash
# Typecheck all packages
pnpm run typecheck

# Lint entire codebase
pnpm run lint

# Build all packages
pnpm run build
```
