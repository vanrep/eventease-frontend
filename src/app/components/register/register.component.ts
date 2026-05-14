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
  // Guarda los datos del registro
  usuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
  };

  // Guarda la confirmacion y el estado de visibilidad
  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;

  // Guarda los mensajes del formulario
  mensajeOk: string = '';
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // Comprueba si las dos contraseñas coinciden
  passwordsCoinciden(): boolean {
    return this.usuario.password === this.confirmarPassword;
  }

  // Cambia si se ve la contraseña principal
  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Cambia si se ve la contraseña de confirmacion
  toggleMostrarConfirmacion(): void {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  // Envía el registro
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

        // Espera un poco y vuelve al login
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
