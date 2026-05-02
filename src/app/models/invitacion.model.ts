export interface Invitacion {
  // Identificador de la invitacion cuando ya existe en el backend
  id?: number;

  // Estado actual de la invitacion usado en vistas y acciones del usuario
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'NUEVA';

  // Relaciona la invitacion con el evento correspondiente
  eventoId: number;

  // Email del asistente invitado al evento
  emailAsistente: string;

  // Datos ampliados que el backend puede enviar para mostrar la invitacion
  eventoTitulo?: string;
  eventoFecha?: string;
  eventoUbicacion?: string;
  clienteEmail?: string;
}