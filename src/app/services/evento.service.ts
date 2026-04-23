import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  // url base de eventos
  private apiUrl = 'http://localhost:8080/eventos';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // crear cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // obtener eventos del usuario logueado
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // crear un evento nuevo
  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento, {
      headers: this.getHeaders(),
    });
  }

  // obtener un evento por su id
  obtenerEvento(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // actualizar un evento
  actualizarEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento, {
      headers: this.getHeaders(),
    });
  }

  // eliminar un evento
  eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
