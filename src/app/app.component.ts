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
  isMainPage = false;  // true cuando estamos en rutas principales de la app
  isAuthPage = false;  // true cuando estamos en login o registro
  currentUrl = '';     // almacena la ruta activa actual
  btnSubir = false;    // controla la visibilidad del boton de volver arriba

  constructor(private router: Router) {
    // Recupera el tema guardado y lo aplica al cargar la aplicacion
    const savedTheme = localStorage.getItem('theme');
    // Si el usuario tiene la preferencia de Dark Mode - lo aplica
    if (savedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }

    // Escucha cada cambio de ruta y actualiza el estado del componente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Guarda la URL final tras posibles redirecciones
      this.currentUrl = event.urlAfterRedirects || event.url;

      // Lleva la vista al inicio en cada cambio de ruta
      window.scrollTo(0, 0);

      // Detecta si la ruta actual es una pagina de autenticacion
      this.isAuthPage = this.currentUrl === '/login' || this.currentUrl === '/register';

      // Marca las rutas donde se activa la presentacion principal del sitio
      this.isMainPage = this.currentUrl === '/inicio' || this.currentUrl === '/' || 
                        this.currentUrl.includes('inicio') || this.currentUrl.includes('crear') ||
                        this.currentUrl.includes('/eventos') || this.currentUrl.includes('/invitaciones') || this.currentUrl.includes('admin');
    });
  }

  // Detecta el scroll de la ventana para mostrar u ocultar el boton de subir
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
