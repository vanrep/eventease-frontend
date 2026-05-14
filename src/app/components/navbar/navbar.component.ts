import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Indica si la navbar tiene scroll
  isScrolled = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  // Detecta el scroll de la ventana
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  // Si ya estas en inicio, hace scroll arriba
  onInicioClick(event: Event) {
    if (this.router.url === '/inicio' || this.router.url === '/') {
      event.preventDefault();

      // Mueve la pagina arriba del todo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Cambia entre light y dark mode
  toggleDarkMode() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  // Cierra sesion y manda al login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
