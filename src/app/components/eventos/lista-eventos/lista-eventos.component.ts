import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
import { InvitacionService } from '../../../services/invitacion.service';
import { AuthService } from '../../../services/auth.service';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-lista-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css',
})
export class ListaEventosComponent implements OnInit {
  eventos: Evento[] = [];
  mensajeError: string = '';

  constructor(
    private eventoService: EventoService,
    private invitacionService: InvitacionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

  // Cargar eventos propios primero, luego invitaciones (secuencial simple)
  cargarTodo(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;

        this.eventos.sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
      },
      error: (error) => {
        this.mensajeError = 'Error al cargar los eventos';
      }
    });
  }

  // Comprobar si el usuario es el organizador
  esOrganizador(evento: Evento): boolean {
    const currentUserId = this.authService.obtenerUsuarioId();
    if (!currentUserId || !evento.clienteId) return false;
    return Number(evento.clienteId) === Number(currentUserId);
  }

  // Calcular días restantes para el evento
  calcularDiasRestantes(fechaEvento: string): number {
    const hoy = new Date();
    const evento = new Date(fechaEvento);
    const diferencia = evento.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias > 0 ? dias : 0;
  }
}
