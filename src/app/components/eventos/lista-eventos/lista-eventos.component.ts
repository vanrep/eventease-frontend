import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { AuthService } from '../../../services/auth.service';
import { Evento } from '../../../models/evento.model';
import { FiltroEventosPipe } from '../filter-eventos.pipe';

@Component({
  selector: 'app-lista-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FiltroEventosPipe],
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css',
})
export class ListaEventosComponent implements OnInit {

  eventos: Evento[] = [];
  mensajeError: string = '';

  textoBusqueda: string = '';
  filtroTodos: boolean = true;
  filtroPendiente: boolean = false;
  filtroAceptada: boolean = false;
  filtroRechazada: boolean = false;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

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

  seleccionarTodos(): void {
    this.filtroTodos = true;
    this.filtroPendiente = false;
    this.filtroAceptada = false;
    this.filtroRechazada = false;
  }

  actualizarFiltros(): void {
    if (this.filtroPendiente || this.filtroAceptada || this.filtroRechazada) {
      this.filtroTodos = false;
    } else {
      this.filtroTodos = true;
    }
  }

  esOrganizador(evento: Evento): boolean {
    const currentUserId = this.authService.obtenerUsuarioId();

    if (!currentUserId || !evento.clienteId) {
      return false;
    }

    return Number(evento.clienteId) === Number(currentUserId);
  }

  calcularDiasRestantes(fechaEvento: string): number {
    const hoy = new Date();
    const evento = new Date(fechaEvento);
    const diferencia = evento.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));

    return dias > 0 ? dias : 0;
  }
}