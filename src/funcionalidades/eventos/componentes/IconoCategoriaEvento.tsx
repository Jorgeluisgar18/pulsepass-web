import type { CategoriaEvento } from '../tipos'

interface IconoCategoriaEventoProps {
  categoria: CategoriaEvento
  className?: string
}

export default function IconoCategoriaEvento({
  categoria,
  className = 'h-16 w-16',
}: IconoCategoriaEventoProps) {
  if (categoria === 'MUSIC') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    )
  }

  if (categoria === 'SPORTS') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M7 7l10 10M17 7 7 17" />
      </svg>
    )
  }

  if (categoria === 'TECHNOLOGY') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    )
  }

  if (categoria === 'EDUCATION') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 5.5A4.5 4.5 0 0 1 7.5 4H11v15H7.5A4.5 4.5 0 0 0 3 20.5z" />
        <path d="M21 5.5A4.5 4.5 0 0 0 16.5 4H13v15h3.5a4.5 4.5 0 0 1 4.5 1.5z" />
      </svg>
    )
  }

  if (categoria === 'CULTURE') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h16M6 17h12M7 17V9M12 17V9M17 17V9M4 7h16L12 3z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 2.5 5.2 5.5.8-4 4 .9 5.6L12 16l-4.9 2.6L8 13 4 9l5.5-.8z" />
    </svg>
  )
}
