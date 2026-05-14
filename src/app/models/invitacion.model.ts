// Modelo de una invitacion de evento
export interface Invitacion {
  id?: number;

  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA';

  eventoId: number;

  emailAsistente: string;

  eventoTitulo?: string;
  eventoFecha?: string;
  eventoUbicacion?: string;
  clienteEmail?: string;
}