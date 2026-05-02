import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { AuthService } from './auth.service';
import { EventoDetalles } from '../models/evento-detalles';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  // Endpoint base para las operaciones relacionadas con eventos
  private apiUrl = 'http://localhost:8080/eventos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtiene los eventos asociados al usuario autenticado
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // Crea un nuevo evento con los datos enviados desde el formulario
  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // Obtiene el detalle de un evento concreto a partir de su id
  obtenerEvento(id: number): Observable<EventoDetalles> {
    return this.http.get<EventoDetalles>(`${this.apiUrl}/${id}`);
  }

  // Actualiza un evento existente identificado por su id
  actualizarEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/${id}`, evento);
  }

  // Elimina un evento existente identificado por su id
  eliminarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
