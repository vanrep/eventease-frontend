import { Pipe, PipeTransform } from '@angular/core';
import { Evento } from '../../models/evento.model';

@Pipe({
  name: 'filtroEventos',
  standalone: true
})
export class FiltroEventosPipe implements PipeTransform {

  // Recibe el array de eventos y los criterios activos de busqueda y estado
  // Devuelve un nuevo array con solo los eventos que cumplen todos los criterios
  transform(
    eventos: Evento[] | null | undefined,
    texto: string,
    pendiente: boolean,
    aceptada: boolean,
    rechazada: boolean
  ): Evento[] {
    if (!eventos) return [];

    let resultado = eventos;

    // Filtrar por texto si hay algo escrito en el buscador
    if (texto && texto.trim() !== '') {
      const t = texto.toLowerCase();
      resultado = resultado.filter(e =>
        e.titulo.toLowerCase().includes(t) ||
        e.descripcion.toLowerCase().includes(t)
      );
    }

    // Filtrar por estado de invitacion si hay algun checkbox activo
    if (pendiente || aceptada || rechazada) {
      resultado = resultado.filter(e =>
        (pendiente && e.miEstadoInvitacion === 'PENDIENTE') ||
        (aceptada && e.miEstadoInvitacion === 'ACEPTADA') ||
        (rechazada && e.miEstadoInvitacion === 'RECHAZADA')
      );
    }

    return resultado;
  }
}
