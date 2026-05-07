import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-pagina',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-pagina.component.html',
  styleUrl: './error-pagina.component.css',
})
export class ErrorPaginaComponent {}