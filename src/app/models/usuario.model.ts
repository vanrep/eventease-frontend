export interface Usuario {
  // Modelo base del usuario usado sobre todo en el registro
  id?: number;
  nombre?: string;
  email: string;
  password: string;
}
