function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-sm">
          <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
            React + Vite + Tailwind
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frontend ready to build.
          </h1>

          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Your app is scaffolded and styled with Tailwind CSS, ready for the rest of your project UI.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Get started
            </button>
            <button className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
              View docs
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
