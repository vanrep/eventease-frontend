import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminUsuario } from '../../models/admin-usuario.model';
import { Evento } from '../../models/evento.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  seccionActiva: string = 'usuarios';
  usuarios: AdminUsuario[] = [];
  eventos: Evento[] = [];
  cargandoUsuarios = false;
  cargandoEventos = false;
  mensajeErrorUsuarios = '';
  mensajeErrorEventos = '';
  eliminandoUsuarioId: number | null = null;
  eliminandoEventoId: number | null = null;

  readonly secciones = [
    { id: 'usuarios', label: 'Usuarios', icono: 'fa-users', disabled: false },
    { id: 'eventos', label: 'Eventos', icono: 'fa-calendar-days', disabled: false },
    { id: 'lugares', label: 'Lugares', icono: 'fa-map-location-dot', disabled: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const seccion = params.get('section');
      this.seccionActiva = this.esSeccionValida(seccion) ? seccion : 'usuarios';

      if (this.seccionActiva === 'usuarios') {
        this.cargarUsuarios();
      } else if (this.seccionActiva === 'eventos') {
        this.cargarEventos();
      }
    });
  }

  private cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.mensajeErrorUsuarios = '';

    this.adminService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargandoUsuarios = false;
      },
      error: () => {
        this.mensajeErrorUsuarios = 'No se pudieron cargar los usuarios';
        this.cargandoUsuarios = false;
      },
    });
  }

  private cargarEventos(): void {
    this.cargandoEventos = true;
    this.mensajeErrorEventos = '';

    this.adminService.obtenerEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.cargandoEventos = false;
      },
      error: () => {
        this.mensajeErrorEventos = 'No se pudieron cargar los eventos';
        this.cargandoEventos = false;
      },
    });
  }

  eliminarUsuario(id: number): void {
    this.eliminandoUsuarioId = id;
    this.mensajeErrorUsuarios = '';

    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter((usuario) => usuario.id !== id);
        this.eliminandoUsuarioId = null;
      },
      error: () => {
        this.mensajeErrorUsuarios = 'No se pudo eliminar el usuario';
        this.eliminandoUsuarioId = null;
      },
    });
  }

  eliminarEvento(id: number): void {
    this.eliminandoEventoId = id;
    this.mensajeErrorEventos = '';

    this.adminService.eliminarEvento(id).subscribe({
      next: () => {
        this.eventos = this.eventos.filter((evento) => evento.id !== id);
        this.eliminandoEventoId = null;
      },
      error: () => {
        this.mensajeErrorEventos = 'No se pudo eliminar el evento';
        this.eliminandoEventoId = null;
      },
    });
  }

  private esSeccionValida(seccion: string | null): seccion is string {
    return this.secciones.some((item) => item.id === seccion && !item.disabled);
  }
}