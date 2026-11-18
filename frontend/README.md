# Frontend Application (@project-template/frontend)

The client application is built with **React 19**, **Vite**, **Tailwind CSS v4**, and a semantic design token system. It delegates all authentication to a shared Central Auth Service.

---

## 🛠 Tech Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + 3-layer CSS Design Token architecture (`tokens.css`)
- **State & Context**: `AuthContext` + `useAuth()` hook
- **API & Networking**: Pre-configured `apiFetch` (automatic cookie handling + transparent 401 retry)
- **Component System**: Fully accessible, token-driven UI primitives (`Button`, `Badge`, `Card`, `Modal`, `Navbar`, `Sidebar`, `ConfirmDelete`, `UserModal`, `WelcomeScreen`)

---

## 🔐 Authentication Architecture

This application does not implement login forms or manage user credentials. All authentication is delegated to the **Central Auth Service**:

1. **`useAuth()`**: React hook providing session state (`user`, `isLoading`, `isAuthenticated`, `error`, `authLoopDetected`).
2. **`ProtectedRoute`**: Declarative gate component wrapping private pages. If the user is unauthenticated, it automatically redirects to the Central Auth Service (`/login?next=...`) and handles recovery if an authentication loop occurs.
3. **`apiFetch`**: Wrapper around `fetch` for your backend API endpoints. Automatically includes cookies (`credentials: 'include'`), attempts silent token refresh on 401, and retries the request once before redirecting to login.

```tsx
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { useAuth } from './context/useAuth.js';
import { apiFetch } from './services/api.js';

function MyDashboard() {
  const { user, logout } = useAuth();

  const handleFetchData = async () => {
    const res = await apiFetch('/api/items');
    const data = await res.json();
  };

  return (
    <div>
      <h1>Welcome, {user?.name || user?.email}</h1>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}

export default function App() {
  return (
    <ProtectedRoute>
      <MyDashboard />
    </ProtectedRoute>
  );
}
```

---

## 🎨 Design System & Styling

The frontend uses a 3-layer token system:
- **Primitive Tokens**: Core color palettes, raw spacing, radius scales (`--primitive-blue-600`, `--space-4`, etc.).
- **Semantic Tokens**: Contextual tokens supporting light & dark mode (`--bg-app`, `--bg-surface`, `--primary`, `--fg-default`).
- **Component Tokens**: Button, input, modal radii and heights (`--button-radius`, `--control-md`).

Themes are activated automatically via CSS variables and `[data-theme='dark']`. See [`src/styles/design-system.md`](./src/styles/design-system.md) for full documentation.

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/      # UI components (Button, Modal, Card, Navbar, ProtectedRoute, etc.)
│   ├── config/          # Environment variables (AUTH_SERVICE_URL, API_URL)
│   ├── context/         # AuthContext, AuthProvider, useAuth hook
│   ├── services/        # auth.ts (auth service client), api.ts (apiFetch client)
│   ├── styles/          # tokens.css, index.css, design-system.md
│   ├── App.tsx          # Main application shell
│   └── main.tsx         # React root mounting
├── index.html           # HTML template
├── vite.config.ts       # Vite build & Tailwind plugin config
└── package.json
```

---

## 🚀 Scripts

- `pnpm dev`: Start local Vite development server (`http://localhost:5173`)
- `pnpm build`: Typecheck and produce optimized production bundle in `dist/`
- `pnpm typecheck`: Run TypeScript compiler check without emitting files
- `pnpm lint`: Run ESLint on all frontend files
- `pnpm preview`: Preview production build locally
