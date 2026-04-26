import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: '',
  };

  mostrarPassword: boolean = false;

  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // enviar login
  iniciarSesion(): void {
    this.mensajeError = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.guardarToken(response.token);
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'Email o contraseña incorrectos';
      },
    });
  }
}
