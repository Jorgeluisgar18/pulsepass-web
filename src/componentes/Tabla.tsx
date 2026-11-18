import type { Key, ReactNode } from 'react'

export interface ColumnaTabla<T> {
    encabezado: string
    celda: (fila: T) => ReactNode
}

interface TablaProps<T> {
    columnas: ColumnaTabla<T>[]
    filas: T[]
    obtenerClave: (fila: T) => Key
}

export default function Tabla<T>({
                                     columnas,
                                     filas,
                                     obtenerClave,
                                 }: TablaProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
                <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                    {columnas.map((columna) => (
                        <th
                            key={columna.encabezado}
                            scope="col"
                            className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200"
                        >
                            {columna.encabezado}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {filas.map((fila) => (
                    <tr
                        key={obtenerClave(fila)}
                        className="border-b border-slate-100 dark:border-slate-800"
                    >
                        {columnas.map((columna) => (
                            <td
                                key={columna.encabezado}
                                className="px-4 py-3 text-slate-700 dark:text-slate-300"
                            >
                                {columna.celda(fila)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}