import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invitacion } from '../models/invitacion.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvitacionService {
  private apiUrl = 'http://localhost:8080/invitaciones';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Invitar a un usuario por email
  invitarUsuario(eventoId: number, emailAsistente: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { eventoId, emailAsistente }, { headers: this.getHeaders() });
  }

  // Listar invitaciones recibidas
  obtenerInvitaciones(): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Aceptar invitación
  aceptarInvitacion(eventoId: number): Observable<Invitacion> {
    return this.http.put<Invitacion>(
      `${this.apiUrl}/evento/${eventoId}/aceptar`,
      {},
      { headers: this.getHeaders() }
    );
  }
  
  // Rechazar invitación
  rechazarInvitacion(eventoId: number): Observable<Invitacion> {
    return this.http.put<Invitacion>(
      `${this.apiUrl}/evento/${eventoId}/rechazar`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
