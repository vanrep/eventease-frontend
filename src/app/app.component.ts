import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isInicio = false;
  isAuthPage = false;
  currentUrl = '';
  btnSubir = false;

  constructor(private router: Router) {
    // Recupera el tema guardado y lo aplica al cargar la aplicacion
    const savedTheme = localStorage.getItem('theme');
    // Si el usuario tiene la preferencia de Dark Mode - lo aplica
    if (savedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects || event.url;

      // Lleva la vista al inicio en cada cambio de ruta
      window.scrollTo(0, 0);

      this.isAuthPage = this.currentUrl === '/login' || this.currentUrl === '/register';

      // Marca las rutas donde se activa la presentacion principal del sitio
      this.isInicio = this.currentUrl === '/inicio' || this.currentUrl === '/' || 
                      this.currentUrl.includes('inicio') || this.currentUrl.includes('crear') ||
                      this.currentUrl.includes('/eventos') || this.currentUrl.includes('/invitaciones') || this.currentUrl.includes('admin');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Muestra el boton flotante cuando el usuario ya ha bajado suficiente
    this.btnSubir = window.pageYOffset > 300;
  }

  scrollToTop() {
    // Desplaza la pagina suavemente hasta la parte superior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
