interface EncabezadoAuthProps {
  titulo: string
}

export default function EncabezadoAuth({ titulo }: EncabezadoAuthProps) {
  return (
    <header className="mb-6 text-center">
      <span className="bg-marca-600 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l10-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      </span>
      <h1 className="font-titulo text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        {titulo}
      </h1>
    </header>
  )
}
