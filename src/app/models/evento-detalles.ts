import { Evento } from './evento.model';
import { Invitacion } from './invitacion.model';

// Amplia el modelo base del evento con la lista de invitaciones asociadas
export interface EventoDetalles extends Evento {
  // Invitaciones del evento cuando el backend devuelve el detalle completo
  invitaciones?: Invitacion[];
}