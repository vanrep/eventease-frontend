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

  constructor(private http: HttpClient) {}

  // hacer login
  login(datosLogin: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, datosLogin);
  }

  // registrar usuario nuevo
  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
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
}
