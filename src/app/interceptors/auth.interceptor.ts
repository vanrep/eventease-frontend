import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor para añadir el token JWT y manejar errores de sesión
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let authReq = req;

  // Si tenemos un token, clonamos la petición y añadimos la cabecera
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si recibimos un 401 (No autorizado) o 403 (Prohibido/Expirado)
      if (error.status === 401 || error.status === 403) {
        console.warn('Sesión expirada o no autorizada. Redirigiendo a login...');
        
        // Limpiamos el token antiguo
        localStorage.removeItem('token');
        
        // Redirigimos al usuario al login
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
