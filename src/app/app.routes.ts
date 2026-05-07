import { Routes } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ListaEventosComponent } from './components/eventos/lista-eventos/lista-eventos.component';
import { CrearEventoComponent } from './components/eventos/crear-evento/crear-evento.component';
import { DetalleEventoComponent } from './components/eventos/detalle-evento/detalle-evento.component';
import { ListaInvitacionesComponent } from './components/invitaciones/lista-invitaciones/lista-invitaciones.component';
import { AdminComponent } from './components/admin/admin.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ErrorPaginaComponent } from './components/error-pagina/error-pagina.component';

export const routes: Routes = [

  // Redirige la ruta raiz a la pagina de inicio
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Rutas publicas de acceso y bienvenida
  { path: 'inicio', component: InicioComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas relacionadas con la gestion de eventos
  { path: 'eventos', component: ListaEventosComponent },
  { path: 'eventos/crear', component: CrearEventoComponent },
  { path: 'eventos/:id', component: DetalleEventoComponent },

  // Ruta para consultar las invitaciones del usuario
  { path: 'invitaciones', component: ListaInvitacionesComponent },

  // Ruta para el panel del administrador
  { path: 'admin', component: AdminComponent },

  // Muestra una pagina de error para cualquier ruta desconocida
  { path: '**', component: ErrorPaginaComponent }
];