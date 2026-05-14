import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitacionService } from '../../../services/invitacion.service';
import { Invitacion } from '../../../models/invitacion.model';

@Component({
  selector: 'app-lista-invitaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-invitaciones.component.html',
  styleUrl: './lista-invitaciones.component.css'
})
export class ListaInvitacionesComponent implements OnInit {
  // Guarda el array de invitaciones
  invitaciones: Invitacion[] = [];

  // Guarda el mensaje de error
  mensajeError: string = '';

  constructor(private invitacionService: InvitacionService) {}

  // Al entrar en la vista, carga las invitaciones
  ngOnInit(): void {
    this.cargarInvitaciones();
  }

  // Pide las invitaciones al backend
  cargarInvitaciones(): void {
    this.invitacionService.obtenerInvitaciones().subscribe({
      next: (data) => {
        this.invitaciones = data;
      },
      error: (err) => {
        console.error(err);

        // Si falla la carga, guarda este mensaje
        this.mensajeError = 'No se pudieron cargar las invitaciones';
      },
    });
  }

  // Según el boolean, acepta o rechaza la invitacion
  responder(eventoId: number | undefined, aceptar: boolean): void {
    if (!eventoId) {
      return;
    }

    const request = aceptar
      ? this.invitacionService.aceptarInvitacion(eventoId)
      : this.invitacionService.rechazarInvitacion(eventoId);

    request.subscribe({
      next: () => {
        this.cargarInvitaciones();
      },
      error: (err) => {
        console.error(err);

        // Si falla la respuesta, guarda este mensaje
        this.mensajeError = 'No se pudo procesar la respuesta a la invitación';
      },
    });
  }
}