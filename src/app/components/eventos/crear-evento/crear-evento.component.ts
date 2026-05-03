import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../../services/evento.service';
import { InvitacionService } from '../../../services/invitacion.service';
import { Evento } from '../../../models/evento.model';
import * as L from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

interface Lugar {
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  id: number;
}

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LeafletModule],
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
  emailsInvitados: { email: string; error?: string }[] = [];

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
    scrollWheelZoom: false // Prevent page scroll trapping
  };

  constructor(
    private eventoService: EventoService,
    private invitacionService: InvitacionService,
    private router: Router,
  ) { }

  onMapReady(map: L.Map) {
    this.map = map;
    
    // FIX: Common Leaflet + Angular issue - markers and tiles might not align until a resize is triggered
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // FIX: Redundant icon fix inside onMapReady
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Añadir marcadores
    this.lugares.forEach(lugar => {
      const marker = L.marker([lugar.lat, lugar.lng], { icon: iconDefault })
        .addTo(map)
        .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.direccion}`);
      
      this.lugaresMarkers[lugar.id] = marker;
      
      marker.on('click', () => {
        this.seleccionarLugar(lugar);
      });
    });
  }

  seleccionarLugar(lugar: Lugar) {
    this.lugarSeleccionado = lugar;
    this.evento.ubicacion = `${lugar.nombre} (${lugar.direccion})`;
    
    if (this.map) {
      this.map.flyTo([lugar.lat, lugar.lng], 16, {
        animate: true,
        duration: 1.5
      });
      this.lugaresMarkers[lugar.id].openPopup();
    }
  }

  agregarInvitado(): void {
    this.emailsInvitados.push({ email: '' });
  }

  quitarInvitado(index: number): void {
    this.emailsInvitados.splice(index, 1);
  }

  enviarInvitaciones(eventoId: number): void {
    this.emailsInvitados.forEach((invitado, index) => {
      const email = invitado.email.trim();
      if (!email) return;

      this.emailsInvitados[index].error = undefined;

      this.invitacionService.invitarUsuario(eventoId, email).subscribe({
        next: () => {
          this.emailsInvitados[index].email = '✓ Enviado';
        },
        error: (err) => {
          console.error(`Error invitando a ${email}:`, err);
          if (err.status === 409) {
            this.emailsInvitados[index].error = 'Ya está invitado';
          } else if (err.status === 404) {
            this.emailsInvitados[index].error = 'Usuario no encontrado';
          } else {
            this.emailsInvitados[index].error = 'No se pudo enviar';
          }
        },
      });
    });
  }

  // crear evento
  guardar(): void {
    this.mensajeOk = '';
    this.mensajeError = '';

    this.eventoService.crearEvento(this.evento).subscribe({
      next: (response) => {
        this.mensajeOk = 'Evento creado correctamente';
        if (response.id) {
          this.enviarInvitaciones(response.id);
        }
        setTimeout(() => {
          this.router.navigate(['/eventos']);
        }, 1500);
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'No se pudo crear el evento';
      },
    });
  }
}
