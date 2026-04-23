import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.css',
})
export class CrearEventoComponent {
  evento: Evento = {
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    capacidad: 1,
  };

  mensajeOk: string = '';
  mensajeError: string = '';

  constructor(
    private eventoService: EventoService,
    private router: Router,
  ) {}

  // crear evento
  guardar(): void {
    this.mensajeOk = '';
    this.mensajeError = '';

    this.eventoService.crearEvento(this.evento).subscribe({
      next: (response) => {
        console.log(response);
        this.mensajeOk = 'Evento creado correctamente';

        setTimeout(() => {
          this.router.navigate(['/eventos']);
        }, 1000);
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'No se pudo crear el evento';
      },
    });
  }
}
