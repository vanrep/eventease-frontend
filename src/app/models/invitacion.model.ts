export interface Invitacion {
  id?: number;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVO';
  eventoId: number;
  emailAsistente: string;

  eventoTitulo?: string;
  eventoFecha?: string;
  eventoUbicacion?: string;
  clienteEmail?: string;
}