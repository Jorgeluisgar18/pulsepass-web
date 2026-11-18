import Boton from '../../../componentes/Boton'
import Campo from '../../../componentes/Campo'
import Selector from '../../../componentes/Selector'
import { etiquetaCategoria } from '../../../lib/formato'
import type { Artista } from '../../artistas/tipos'
import type { CategoriaEvento } from '../tipos'

interface BarraFiltrosProps {
    q: string
    categoria: CategoriaEvento | ''
    artista: string
    artistas: Artista[]
    onCambiarQ: (valor: string) => void
    onCambiarCategoria: (
        valor: string,
    ) => void
    onCambiarArtista: (
        valor: string,
    ) => void
    onLimpiar: () => void
}

const categorias: CategoriaEvento[] = [
    'MUSIC',
    'SPORTS',
    'TECHNOLOGY',
    'EDUCATION',
    'CULTURE',
    'ENTERTAINMENT',
]

export default function BarraFiltros({
                                         q,
                                         categoria,
                                         artista,
                                         artistas,
                                         onCambiarQ,
                                         onCambiarCategoria,
                                         onCambiarArtista,
                                         onLimpiar,
                                     }: BarraFiltrosProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_14rem_auto] lg:items-end">
            <Campo
                etiqueta="Buscar por nombre"
                type="search"
                value={q}
                placeholder="Buscar por nombre…"
                onChange={(event) =>
                    onCambiarQ(
                        event.target.value,
                    )
                }
            />

            <Selector
                etiqueta="Categoría"
                value={categoria}
                onChange={(event) =>
                    onCambiarCategoria(
                        event.target.value,
                    )
                }
            >
                <option value="">Todas</option>

                {categorias.map((valor) => (
                    <option
                        key={valor}
                        value={valor}
                    >
                        {etiquetaCategoria(valor)}
                    </option>
                ))}
            </Selector>

            <Selector
                etiqueta="Artista"
                value={artista}
                onChange={(event) =>
                    onCambiarArtista(
                        event.target.value,
                    )
                }
            >
                <option value="">Todos</option>

                {artistas.map((item) => (
                    <option
                        key={item.id}
                        value={item.stageName}
                    >
                        {item.stageName}
                    </option>
                ))}
            </Selector>

            <Boton
                variante="secundario"
                className="w-full lg:w-auto"
                onClick={onLimpiar}
            >
                Limpiar
            </Boton>
        </div>
    )
}