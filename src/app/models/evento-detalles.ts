import { Evento } from './evento.model';
import { Invitacion } from './invitacion.model';

// Anade la lista de invitaciones al evento
export interface EventoDetalles extends Evento {
  // Guarda las invitaciones del evento
  invitaciones?: Invitacion[];
}