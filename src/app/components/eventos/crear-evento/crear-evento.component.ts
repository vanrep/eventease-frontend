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
  // Email tiene que contener @
  emailRegex = /^[^\s@]+@[^\s@]+$/;

  // Fecha minima permitida en el formulario
  minFecha = this.getMinFecha();

  // Datos del evento enlazados al formulario
  evento: Evento = {
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    capacidad: 1,
  };

  // Mensajes y lista de invitados
  mensajeOk: string = '';
  mensajeError: string = '';
  emailsInvitados: { email: string }[] = [];

  // Estado del mapa y marcadores de lugares
  map?: L.Map;
  lugaresMarkers: { [key: number]: L.Marker } = {};

  // Lugares que se pueden elegir
  lugares: Lugar[] = [
    {
      id: 1,
      nombre: 'Pia Eventos',
      direccion: 'C/ Pío XI, 29',
      lat: 39.464,
      lng: -0.395,
    },
    {
      id: 2,
      nombre: 'NIU Events',
      direccion: 'La Zaidía, Valencia',
      lat: 39.487,
      lng: -0.374,
    },
    {
      id: 3,
      nombre: 'La Sala Olimpia',
      direccion: 'Valencia centro',
      lat: 39.47,
      lng: -0.376,
    },
    {
      id: 4,
      nombre: 'Hotel Primus Valencia',
      direccion: 'C/ Menorca, 22',
      lat: 39.458,
      lng: -0.345,
    },
    {
      id: 5,
      nombre: 'Palau Alameda',
      direccion: 'Carrer de l’Arquitecte Mora, 2',
      lat: 39.472,
      lng: -0.364,
    },
    {
      id: 6,
      nombre: 'Palacio de Congresos de Valencia',
      direccion: 'Av. de les Corts Valencianes, 60',
      lat: 39.489,
      lng: -0.402,
    },
  ];

  // Lugar elegido por el usuario
  lugarSeleccionado?: Lugar;

  // Configuracion inicial del mapa
  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 12,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ],
    zoom: 14,
    center: L.latLng(39.4697, -0.3774),
    scrollWheelZoom: false, // Evita que la rueda del raton atrape el scroll de la pagina
  };

  constructor(
    private eventoService: EventoService,
    private invitacionService: InvitacionService,
    private router: Router,
  ) {}

  // Genera la fecha minima en formato local
  private getMinFecha(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  // Guarda la referencia del mapa y crea los marcadores
  onMapReady(map: L.Map) {
    this.map = map;

    // Fuerza un reajuste para que el mapa se pinte bien
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Icono por defecto para los marcadores
    const iconDefault = L.icon({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Anade los marcadores de cada lugar
    this.lugares.forEach((lugar) => {
      const marker = L.marker([lugar.lat, lugar.lng], { icon: iconDefault })
        .addTo(map)
        .bindPopup(`<b>${lugar.nombre}</b><br>${lugar.direccion}`);

      this.lugaresMarkers[lugar.id] = marker;

      marker.on('click', () => {
        this.seleccionarLugar(lugar);
      });
    });
  }

  // Guarda el lugar elegido y centra el mapa en el
  seleccionarLugar(lugar: Lugar) {
    this.lugarSeleccionado = lugar;
    this.evento.ubicacion = `${lugar.nombre} (${lugar.direccion})`;

    if (this.map) {
      this.map.flyTo([lugar.lat, lugar.lng], 16, {
        animate: true,
        duration: 1.5,
      });
      this.lugaresMarkers[lugar.id].openPopup();
    }
  }

  // Anade una fila nueva de invitado
  agregarInvitado(): void {
    this.emailsInvitados.push({ email: '' });
  }

  // Quita un invitado de la lista
  quitarInvitado(index: number): void {
    this.emailsInvitados.splice(index, 1);
  }

  // Revisa que los emails escritos tengan un formato valido
  private hayEmailsInvalidos(): boolean {
    return this.emailsInvitados.some((invitado) => {
      const email = invitado.email.trim();
      return !!email && !this.emailRegex.test(email);
    });
  }

  // Envia las invitaciones a los emails validos
  enviarInvitaciones(eventoId: number): void {
    this.emailsInvitados.forEach((invitado, index) => {
      const email = invitado.email.trim();
      if (!email) return;

      this.invitacionService.invitarUsuario(eventoId, email).subscribe({
        next: () => {
          this.emailsInvitados[index].email = '✓ Enviado';
        },
        error: (err) => {
          console.error(`Error invitando a ${email}:`, err);
          if (err.status === 409) {
            this.mensajeError = 'Ya hay invitaciones repetidas';
          } else if (err.status === 404) {
            this.mensajeError = 'Hay emails de invitados que no existen';
          } else {
            this.mensajeError = 'No se pudo enviar alguna invitacion';
          }
        },
      });
    });
  }

  // Crea el evento si los campos obligatorios estan completos
  guardar(): void {
    this.mensajeOk = '';
    this.mensajeError = '';

    // Revisa si falta algun campo obligatorio
    const camposFaltantes: string[] = [];
    if (!this.evento.titulo) camposFaltantes.push('Nombre del evento');
    if (!this.evento.fecha) camposFaltantes.push('Fecha');
    if (!this.evento.capacidad) camposFaltantes.push('Capacidad');
    if (!this.evento.ubicacion) camposFaltantes.push('Lugar');

    if (camposFaltantes.length > 0) {
      this.mensajeError =
        'Faltan campos obligatorios: ' + camposFaltantes.join(', ');
      return;
    }

    if (this.hayEmailsInvalidos()) {
      this.mensajeError = 'Revisa los emails de las invitaciones';
      return;
    }

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
