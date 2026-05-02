import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invitacion } from '../models/invitacion.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvitacionService {
  // Endpoint base para las operaciones relacionadas con invitaciones
  private apiUrl = 'http://localhost:8080/invitaciones';

  constructor(
    private http: HttpClient
  ) { }

  // Envía una invitacion a un asistente para un evento concreto
  invitarUsuario(eventoId: number, emailAsistente: string): Observable<Invitacion> {
    return this.http.post<Invitacion>(this.apiUrl, { eventoId, emailAsistente });
  }

  // Obtiene las invitaciones del usuario autenticado
  obtenerInvitaciones(): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(this.apiUrl);
  }

  // Marca una invitacion como aceptada a partir del id del evento
  aceptarInvitacion(eventoId: number): Observable<Invitacion> {
    return this.http.put<Invitacion>(
      `${this.apiUrl}/evento/${eventoId}/aceptar`,
      {}
    );
  }
  
  // Marca una invitacion como rechazada a partir del id del evento
  rechazarInvitacion(eventoId: number): Observable<Invitacion> {
    return this.http.put<Invitacion>(
      `${this.apiUrl}/evento/${eventoId}/rechazar`,
      {}
    );
  }
}
