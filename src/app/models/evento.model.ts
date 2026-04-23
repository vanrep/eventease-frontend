export interface Evento {
  // modelo de evento para crear y mostrar eventos
  id?: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;
  clienteId?: number;
}
