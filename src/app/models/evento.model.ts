export interface Evento {
  // Identificador del evento cuando ya existe en el backend
  id?: number;

  // Datos principales del evento que se usan en formularios y listados
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;

  // Datos del organizador que el backend puede incluir en la respuesta
  clienteId?: number;

  clienteEmail?: string

  // Estado de la invitacion del usuario actual cuando el evento llega por invitacion
  miEstadoInvitacion?: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA'
}
