import { Pipe, PipeTransform } from '@angular/core';
import { Evento } from '../../models/evento.model';

@Pipe({
  name: 'filtroEventos',
  standalone: true,
})
export class FiltroEventosPipe implements PipeTransform {
  // Recibe el array y devuelve solo los eventos que pasan los filtros
  transform(
    eventos: Evento[] | null | undefined,
    texto: string,
    pendiente: boolean,
    aceptada: boolean,
    rechazada: boolean,
  ): Evento[] {
    if (!eventos) return [];

    let resultado = eventos;

    // Si hay texto, filtra por titulo o descripcion
    if (texto && texto.trim() !== '') {
      const t = texto.toLowerCase();
      resultado = resultado.filter(
        (e) =>
          e.titulo.toLowerCase().includes(t) ||
          e.descripcion.toLowerCase().includes(t),
      );
    }

    // Si hay checks activos, filtra por estado
    if (pendiente || aceptada || rechazada) {
      resultado = resultado.filter(
        (e) =>
          (pendiente && e.miEstadoInvitacion === 'PENDIENTE') ||
          (aceptada && e.miEstadoInvitacion === 'ACEPTADA') ||
          (rechazada && e.miEstadoInvitacion === 'RECHAZADA'),
      );
    }

    return resultado;
  }
}
