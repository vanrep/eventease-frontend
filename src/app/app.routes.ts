import { Routes } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ListaEventosComponent } from './components/eventos/lista-eventos/lista-eventos.component';
import { CrearEventoComponent } from './components/eventos/crear-evento/crear-evento.component';
import { ListaInvitacionesComponent } from './components/invitaciones/lista-invitaciones/lista-invitaciones.component';

export const routes: Routes = [

  // redirección inicial
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // páginas públicas
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // eventos
  { path: 'eventos', component: ListaEventosComponent },
  { path: 'eventos/crear', component: CrearEventoComponent },

  // invitaciones
  { path: 'invitaciones', component: ListaInvitacionesComponent },

  // página no encontrada
  { path: '**', redirectTo: 'inicio' }
];