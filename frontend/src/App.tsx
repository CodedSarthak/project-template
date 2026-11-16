import { AuthProvider } from './context/AuthContext.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        {/* Your application code goes here */}
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <main className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-3xl font-bold tracking-tight">App Template</h1>
            <p className="mt-2 text-slate-400">
              Your application is protected and authenticated. Start building your UI and business logic here.
            </p>
          </main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
