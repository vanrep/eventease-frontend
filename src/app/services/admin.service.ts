import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { AdminUsuario } from '../models/admin-usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // Guarda la URL base del panel admin
  private apiUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  // Pide la lista de usuarios
  obtenerUsuarios(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(`${this.apiUrl}/usuarios`);
  }

  // Pide la lista de eventos
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`);
  }

  // Elimina un usuario por id
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  // Elimina un evento por id
  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${id}`);
  }
}