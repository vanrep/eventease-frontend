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
  usuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
  };

  confirmarPassword: string = '';
  mostrarPassword: boolean = false;
  mostrarConfirmacion: boolean = false;

  mensajeOk: string = '';
  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  passwordsCoinciden(): boolean {
    return this.usuario.password === this.confirmarPassword;
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleMostrarConfirmacion(): void {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  // enviar datos de registro
  registrar(): void {
    this.mensajeOk = '';
    this.mensajeError = '';

    if (!this.passwordsCoinciden()) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.usuario).subscribe({
      next: (response) => {
        console.log(response);
        this.mensajeOk = 'Usuario registrado correctamente';

        // volver al login después del registro
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
