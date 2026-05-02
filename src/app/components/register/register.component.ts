import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // Modelo enlazado al formulario de registro
  usuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
  };

  // Estados auxiliares para validacion y visibilidad de contrasenas
  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;

  // Mensajes mostrados tras intentar registrar al usuario
  mensajeOk: string = '';
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // Comprueba si ambas contrasenas introducidas coinciden
  passwordsCoinciden(): boolean {
    return this.usuario.password === this.confirmarPassword;
  }

  // Alterna la visibilidad de la contrasena principal
  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Alterna la visibilidad de la contrasena de confirmacion
  toggleMostrarConfirmacion(): void {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  // Envía el formulario de registro al backend
  registrar(): void {
    this.mensajeOk = '';
    this.mensajeError = '';

    if (!this.passwordsCoinciden()) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.usuario).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario registrado correctamente';

        // Vuelve al login tras mostrar el mensaje de confirmacion
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'No se pudo registrar el usuario';
      },
    });
  }
}
