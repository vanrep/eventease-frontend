import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { AuthResponse } from '../models/auth-response';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Endpoint base para las operaciones de autenticacion y registro
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  
  // Registra un nuevo usuario en el backend
  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }

  // Envía las credenciales y recibe el token de autenticacion
  login(datosLogin: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, datosLogin);
  }

  // Guarda el token JWT en el almacenamiento local del navegador
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Recupera el token JWT almacenado si existe
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Elimina el token almacenado al cerrar sesion
  logout(): void {
    localStorage.removeItem('token');
  }

  // Indica si actualmente hay un token guardado
  estaLogueado(): boolean {
    return this.obtenerToken() != null;
  }

  // Extrae el identificador del usuario desde el contenido del token
  obtenerUsuarioId(): number | null {
    const payload = this.obtenerPayloadToken();
    return payload?.['userId'] ? Number(payload['userId']) : null;
  }

  // Extrae el rol del usuario desde el contenido del token
  obtenerRol(): string | null {
    const payload = this.obtenerPayloadToken();
    if (!payload) return null;

    return String(payload['rol'] || payload['role'] || payload['authorities'] || '') || null;
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }

  // Obtiene el email principal almacenado en el token
  obtenerEmail(): string {
    const payload = this.obtenerPayloadToken();
    return typeof payload?.['sub'] === 'string' ? payload['sub'] : '';
  }

  // Genera la inicial que se muestra para el usuario autenticado
  obtenerInicialUsuario(): string {
    const email = this.obtenerEmail();

    if (!email) {
      return '?';
    }

    return email.charAt(0).toUpperCase();
  }

  private obtenerPayloadToken(): Record<string, unknown> | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }
}
