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

  invitaciones: Invitacion[] = [];
  mensajeError: string = '';

  constructor(private invitacionService: InvitacionService) {}

  ngOnInit(): void {
    this.cargarInvitaciones();
  }

  cargarInvitaciones(): void {
    this.invitacionService.obtenerInvitaciones().subscribe({
      next: (data) => {
        this.invitaciones = data;
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'No se pudieron cargar las invitaciones';
      }
    });
  }

  responder(id: number | undefined, aceptar: boolean): void {
    if (!id) {
      return;
    }

    const request = aceptar
      ? this.invitacionService.aceptarInvitacion(id)
      : this.invitacionService.rechazarInvitacion(id);

    request.subscribe({
      next: () => {
        this.cargarInvitaciones();
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'No se pudo procesar la respuesta a la invitación';
      }
    });
  }
}