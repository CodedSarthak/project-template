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
Ensure your `DATABASE_URL` and `JWT_ACCESS_SECRET` are populated.

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

> **Note — Central Auth Service**: The frontend contacts the central auth service (login, logout, token refresh) via `VITE_AUTH_SERVICE_URL`. In development this defaults to `http://localhost:3001`. Make sure your local auth service is running on that port, or update `frontend/.env` to point to wherever it is running. In production this will be the deployed auth service URL.

---

## 🔐 Central Auth Service & Shared Domain Architecture

Every application created from this template delegates authentication to a single, shared external auth service rather than implementing its own auth endpoints or user tables.

> [!WARNING]
> ### ⚠️ Critical: Shared Domain Cookie Requirement
> 
> The central auth service manages sessions via secure, `HttpOnly` cookies. For browser cookie sharing to function seamlessly across your micro-frontend ecosystem:
> 
> 1. **Same Root Domain**: The auth service and all template-derived client apps **must share the same parent domain** in production:
>    - Central Auth: `https://auth.myapp.com`
>    - Application 1: `https://dashboard.myapp.com`
>    - Application 2: `https://crm.myapp.com`
> 2. **Cookie Scope**: The central auth service must issue cookies with `Domain=.myapp.com` (note the leading dot) and `SameSite=Lax` (or `None` with `Secure`).
> 3. **Different Domain Failure**: If an application is hosted on an entirely separate root domain (e.g. `myotherdomain.com`), modern browsers will block cross-site cookies, preventing automatic session verification and refresh.
> 4. **Local Multi-App Testing**: For local subdomain testing, add local test domains to your hosts file (`127.0.0.1 auth.myapp.test app.myapp.test`) rather than using mismatched `localhost` ports with strict domain cookies.
> 5. **Matching JWT Secret**: The backend's `JWT_ACCESS_SECRET` (configured in `.env` or AWS Secrets Manager) must be identical to the secret used by the central auth service to sign access tokens.

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
│   │   ├── components/     # Navbar, Sidebar, UserModal, ConfirmDelete, WelcomeScreen, ProtectedRoute
│   │   ├── context/        # AuthProvider, AuthContext, useAuth hook
│   │   ├── services/       # auth.ts (auth service calls), api.ts (apiFetch with auto-refresh)
│   │   ├── config/         # env.ts (AUTH_SERVICE_URL, API_URL)
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
