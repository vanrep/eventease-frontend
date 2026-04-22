import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: '',
  };

  mensajeError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

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
