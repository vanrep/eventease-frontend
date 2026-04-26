export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;
  clienteId?: number;
  clienteEmail?: string
  miEstadoInvitacion?: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA'
}
