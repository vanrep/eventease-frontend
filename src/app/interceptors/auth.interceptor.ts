import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor que adjunta el token JWT y gestiona errores de autenticacion
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let authReq = req;

  // Si existe un token, lo añade a la cabecera Authorization
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si la sesion ya no es valida, limpia el token y redirige al login
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo a login...');

        // Elimina el token almacenado
        authService.logout();

        // Envía al usuario a la pantalla de acceso
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
