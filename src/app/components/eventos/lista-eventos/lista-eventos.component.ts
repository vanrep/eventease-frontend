import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
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

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  // cargar eventos del usuario
  cargarEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (response) => {
        this.eventos = response;
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'No se pudieron cargar los eventos';
      },
    });
  }
}
