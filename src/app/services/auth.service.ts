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
  // cambiar esta URL si tu backend usa otra
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }
  
  // 1) REGISTER --> UsuarioController @PostMapping("/register")
  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }

  // hacer login
  login(datosLogin: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, datosLogin);
  }

  // guardar token en localStorage
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // obtener token guardado
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // borrar token al cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }

  // comprobar si hay token guardado
  estaLogueado(): boolean {
    return this.obtenerToken() != null;
  }

  // obtener id del usuario del token
  obtenerUsuarioId(): number | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const values = JSON.parse(decodedPayload);
      return values.userId ? Number(values.userId) : null;
    } catch (e) {
      console.error('Error al decodificar ID del token', e);
      return null;
    }
  }

  // obtener rol del token (simplificado)
  obtenerRol(): string | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      // El JWT tiene 3 partes separadas por puntos. La del medio es el payload en Base64.
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const values = JSON.parse(decodedPayload);
      return values.rol || values.role || values.authorities || null;
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }

  obtenerEmail(): string {
    const token = this.obtenerToken();
    if (!token) return '';

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const values = JSON.parse(decodedPayload);
      return values.sub || '';
    } catch (e) {
      console.error('Error al decodificar email del token', e);
      return '';
    }
  }

  obtenerInicialUsuario(): string {
    const email = this.obtenerEmail();

    if (!email) {
      return '?';
    }

    return email.charAt(0).toUpperCase();
  }
}
