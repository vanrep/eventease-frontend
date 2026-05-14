export interface Invitacion {
  // Guarda el id de la invitacion
  id?: number;

  // Guarda el estado de la invitacion
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA';

  // Guarda el id del evento
  eventoId: number;

  // Guarda el email del invitado
  emailAsistente: string;

  // Guarda datos extra del evento
  eventoTitulo?: string;
  eventoFecha?: string;
  eventoUbicacion?: string;
  clienteEmail?: string;
}