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
  // Guarda el array de eventos
  eventos: Evento[] = [];

  // Guarda el mensaje de error
  mensajeError: string = '';

  // Guarda el texto del buscador
  textoBusqueda: string = '';

  // Check para mostrar todos los eventos
  filtroTodos: boolean = true;

  // Checks de filtros por estado
  filtroPendiente: boolean = false;
  filtroAceptada: boolean = false;
  filtroRechazada: boolean = false;

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
  ) {}

  // Al entrar en la vista, carga los eventos
  ngOnInit(): void {
    this.cargarTodo();
  }

  // Carga los eventos y los ordena por fecha
  cargarTodo(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;

        // Sort por fecha
        this.eventos.sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
        );
      },
      error: () => {
        // Si falla la carga, guarda este mensaje
        this.mensajeError = 'Error al cargar los eventos';
      },
    });
  }

  // Activa solo el filtroTodos y apaga el resto
  seleccionarTodos(): void {
    this.filtroTodos = true;
    this.filtroPendiente = false;
    this.filtroAceptada = false;
    this.filtroRechazada = false;
  }

  // Si hay algun filtro activado, pone filtroTodos a false
  // Si no hay ninguno activo, vuelve a poner filtroTodos a true
  actualizarFiltros(): void {
    if (this.filtroPendiente || this.filtroAceptada || this.filtroRechazada) {
      this.filtroTodos = false;
    } else {
      this.filtroTodos = true;
    }
  }

  // Comprueba si el current user es el organizador
  esOrganizador(evento: Evento): boolean {
    const currentUserId = this.authService.obtenerUsuarioId();

    // Si falta algun id, devuelve false
    if (!currentUserId || !evento.clienteId) {
      return false;
    }

    // Compara los dos ids
    return Number(evento.clienteId) === Number(currentUserId);
  }

  // Calcula cuantos dias faltan para el evento
  calcularDiasRestantes(fechaEvento: string): number {
    const hoy = new Date();
    const evento = new Date(fechaEvento);
    const diferencia = evento.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));

    // Si ya ha pasado, devuelve 0
    return dias > 0 ? dias : 0;
  }
}
