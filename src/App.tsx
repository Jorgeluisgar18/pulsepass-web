function App() {
  return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a
                href="/"
                className="font-titulo text-xl font-bold text-marca-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marca-600"
            >
              PulsePass
            </a>

            <nav aria-label="Principal">
              <a
                  href="/eventos"
                  className="text-sm font-medium text-slate-600 hover:text-marca-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marca-600"
              >
                Eventos
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className="bg-linear-to-r from-marca-600 to-acento-500 text-white">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
                Eventos · artistas · entradas
              </p>

              <h1 className="font-titulo max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Descubre los mejores eventos
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
                Música, cultura, deporte y tecnología en un solo lugar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                    href="/eventos"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-marca-700 transition hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Ver cartelera
                </a>

                <a
                    href="/registro"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Crear cuenta
                </a>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-marca-600">
                PulsePass Frontend
              </p>

              <h2 className="font-titulo mt-2 text-2xl font-bold">
                Proyecto base configurado
              </h2>

              <p className="mt-3 text-slate-600">
                React, TypeScript estricto, Tailwind CSS v4 y el proxy hacia la
                API ya están preparados.
              </p>
            </div>
          </section>
        </main>
      </div>
  )
}

export default App