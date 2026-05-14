import { Evento } from './evento.model';
import { Invitacion } from './invitacion.model';

// Modelo de evento con sus invitaciones
export interface EventoDetalles extends Evento {
  invitaciones?: Invitacion[];
}