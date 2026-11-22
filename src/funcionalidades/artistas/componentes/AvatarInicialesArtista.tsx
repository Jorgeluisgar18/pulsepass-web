import clsx from 'clsx'

type TamanoAvatar = 'mediano' | 'grande'

interface AvatarInicialesArtistaProps {
  stageName: string
  tamano?: TamanoAvatar
}

const tamanos: Record<TamanoAvatar, string> = {
  mediano: 'h-12 w-12 text-base',
  grande: 'h-24 w-24 text-3xl',
}

function obtenerIniciales(stageName: string) {
  return stageName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export default function AvatarInicialesArtista({
  stageName,
  tamano = 'mediano',
}: AvatarInicialesArtistaProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'bg-marca-50 font-titulo text-marca-700 dark:bg-marca-700 flex shrink-0 items-center justify-center rounded-full font-bold dark:text-white',
        tamanos[tamano],
      )}
    >
      {obtenerIniciales(stageName)}
    </div>
  )
}
