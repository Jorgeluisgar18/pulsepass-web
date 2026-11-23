import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TarjetaEvento from '../../funcionalidades/eventos/componentes/TarjetaEvento'
import { categoriaEventoSchema, type EventoResumen } from '../../funcionalidades/eventos/tipos'
import { etiquetaCategoria } from '../../lib/formato'
import { renderConRouter } from '../utils/renderConRouter'

describe('TarjetaEvento', () => {
  it.each(categoriaEventoSchema.options)('presenta un SVG decorativo y una categoría accesible para %s conservando el enlace y datos', (category) => {
    const evento: EventoResumen = {
      id: 1,
      eventCode: 'CARIBE-2028',
      name: 'Festival del Caribe',
      category,
      status: 'PUBLISHED',
      eventDate: '2028-11-23T20:00:00',
      venueCode: 'CARIBE',
      venueName: 'Centro de Eventos Caribe',
    }
    renderConRouter(<TarjetaEvento evento={evento} />)

    const tarjeta = screen.getByRole('link', { name: new RegExp(etiquetaCategoria(category)) })
    expect(tarjeta).toHaveAttribute('href', '/eventos/CARIBE-2028')
    expect(tarjeta.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(within(tarjeta).getByRole('heading', { name: evento.name })).toBeInTheDocument()
    expect(within(tarjeta).getByText(evento.venueName)).toBeInTheDocument()
    expect(within(tarjeta).getByText('Publicado')).toBeInTheDocument()
    expect(within(tarjeta).getByText(/23 nov 2028/)).toBeInTheDocument()
  })
})
