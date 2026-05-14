export interface Evento {
  // Guarda el id del evento
  id?: number;

  // Guarda los datos principales del evento
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;

  // Guarda el id del creador
  clienteId?: number;

  // Guarda el email del creador
  clienteEmail?: string

  // Guarda el estado de la invitacion del usuario actual
  miEstadoInvitacion?: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA'
}
