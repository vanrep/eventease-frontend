import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  // Registra los proveedores globales que usa toda la aplicacion
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Aplica el interceptor de autenticacion a todas las peticiones HTTP
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync()
  ],
};
