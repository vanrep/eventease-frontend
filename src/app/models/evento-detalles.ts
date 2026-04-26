import { Evento } from './evento.model';
import { Invitacion } from './invitacion.model';

export interface EventoDetalles extends Evento {
  invitaciones?: Invitacion[];
}