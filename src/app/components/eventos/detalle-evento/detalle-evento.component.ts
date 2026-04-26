import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../services/evento.service';
import { AuthService } from '../../../services/auth.service';
import { InvitacionService } from '../../../services/invitacion.service';
import { Evento } from '../../../models/evento.model';
import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Invitacion } from '../../../models/invitacion.model';
import { EventoDetalles } from '../../../models/evento-detalles';

interface Lugar {
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  id: number;
}

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LeafletModule],
  templateUrl: './detalle-evento.component.html',
  styleUrl: './detalle-evento.component.css',
})
export class DetalleEventoComponent implements OnInit {
  evento: EventoDetalles = {
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    capacidad: 1,
    invitaciones: []
  };

  esOrganizador: boolean = false;
  mensajeOk: string = '';
  mensajeError: string = '';

  invitados: Invitacion[] = [];

  // Configuración de Leaflet
  map?: L.Map;
  lugaresMarkers: { [key: number]: L.Marker } = {};

  lugares: Lugar[] = [
    { id: 1, nombre: 'Oceanogràfic Valencia', direccion: 'Carrer d Eduardo Primo Yúfera, 1', lat: 39.453, lng: -0.347 },
    { id: 2, nombre: 'Estadio de Mestalla', direccion: 'Av. de Suècia, s/n', lat: 39.474, lng: -0.358 },
    { id: 3, nombre: 'Palacio de Congresos', direccion: 'Av. de les Corts Valencianes, 60', lat: 39.489, lng: -0.402 },
    { id: 4, nombre: 'Bioparc Valencia', direccion: 'Av. Pío Baroja, 3', lat: 39.478, lng: -0.407 }
  ];

  lugarSeleccionado?: Lugar;

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 12,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 14,
    center: L.latLng(39.4697, -0.3774),
    scrollWheelZoom: false
  };

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private invitacionService: InvitacionService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarEvento(id);
    }
  }

  cargarEvento(id: number): void {
    this.eventoService.obtenerEvento(id).subscribe({
    next: (data) => {
      this.evento = data;
      this.invitados = data.invitaciones ?? [];

      const miId = this.authService.obtenerUsuarioId();
      this.esOrganizador = (miId != null && miId == this.evento.clienteId);

      if (this.evento.ubicacion) {
        const match = this.lugares.find(l => this.evento.ubicacion.includes(l.nombre));
        if (match) this.lugarSeleccionado = match;
      }
    },
      error: (error) => {
        console.error('Error al cargar evento:', error);
        this.mensajeError = 'No se pudo cargar el evento';
      }
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize();
      if (this.lugarSeleccionado) {
        this.map?.flyTo([this.lugarSeleccionado.lat, this.lugarSeleccionado.lng], 16);
      }
    }, 500);

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.lugares.forEach(lugar => {
      const marker = L.marker([lugar.lat, lugar.lng], { icon: iconDefault })
        .addTo(map)
        .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.direccion}`);

      this.lugaresMarkers[lugar.id] = marker;
      marker.on('click', () => {
        if (this.esOrganizador) this.seleccionarLugar(lugar);
      });
    });
  }

  seleccionarLugar(lugar: Lugar) {
    if (!this.esOrganizador) return;
    this.lugarSeleccionado = lugar;
    this.evento.ubicacion = `${lugar.nombre} (${lugar.direccion})`;
    if (this.map) {
      this.map.flyTo([lugar.lat, lugar.lng], 16, { animate: true, duration: 1.5 });
      this.lugaresMarkers[lugar.id].openPopup();
    }
  }

  highlightMarker(lugar: Lugar, highlight: boolean) {
    if (!this.map) return;
    const marker = this.lugaresMarkers[lugar.id];
    if (highlight) {
      marker.openPopup();
      this.map.panTo([lugar.lat, lugar.lng]);
    } else {
      marker.closePopup();
      if (this.lugarSeleccionado) {
        this.map.flyTo([this.lugarSeleccionado.lat, this.lugarSeleccionado.lng], 16);
        this.lugaresMarkers[this.lugarSeleccionado.id].openPopup();
      }
    }
  }

  // DINÁMICA DE INVITADOS
  agregarInvitado() {
    this.invitados.push({ estado: 'NUEVO', eventoId: this.evento.id!, emailAsistente: '' });
  }

  quitarInvitado(index: number) {
    this.invitados.splice(index, 1);
  }

  guardar(): void {
    if (!this.esOrganizador || !this.evento.id) return;

    this.mensajeOk = '';
    this.mensajeError = '';

    this.eventoService.actualizarEvento(this.evento.id, this.evento).subscribe({
      next: () => {
        this.mensajeOk = 'Evento actualizado correctamente';
        // Enviar invitaciones de forma no bloqueante tras guardar
        this.enviarInvitaciones();
        setTimeout(() => {
          this.router.navigate(['/eventos']);
        }, 1500);
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'No se pudo actualizar el evento';
      },
    });
  }

  enviarInvitaciones(): void {
    const eventoId = this.evento.id!;

    this.invitados.forEach((invitado, index) => {
      const email = invitado.emailAsistente.trim();
      if (!email) return; // skip empty rows

      this.invitacionService.invitarUsuario(eventoId, email).subscribe({
        next: () => {
          this.invitados[index].emailAsistente = '✓ Enviado';
        },
        error: (err) => {
          console.error(`Error invitando a ${email}:`, err);
        }
      });
    });
  }

  eliminar(): void {
    if (!this.esOrganizador || !this.evento.id) return;
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventoService.eliminarEvento(this.evento.id).subscribe({
        next: () => this.router.navigate(['/eventos']),
        error: (err) => {
          console.error(err);
          this.mensajeError = 'No se pudo eliminar el evento';
        }
      });
    }
  }

  aceptarInvitacion(): void {
    if (!this.evento || !this.evento.id) {
      return;
    }

    this.invitacionService.aceptarInvitacion(this.evento.id!).subscribe({
      next: () => {
        this.mensajeOk = 'Invitación aceptada correctamente';
        this.router.navigate(['/eventos']);
      },
      error: () => {
        this.mensajeError = 'Error al aceptar la invitación';
      }
    });
  }

  rechazarInvitacion(): void {
    if (!this.evento || !this.evento.id) {
      return;
    }

    this.invitacionService.rechazarInvitacion(this.evento.id!).subscribe({
      next: () => {
        this.mensajeOk = 'Invitación rechazada correctamente';
        this.router.navigate(['/eventos']);
      },
      error: () => {
        this.mensajeError = 'Error al rechazar la invitación';
      }
    });
  }
}
