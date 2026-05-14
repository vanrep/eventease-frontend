import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  // Guarda la seccion activa
  activeSection = 'hero';

  // Guarda el orden de las secciones
  sections = ['hero', 'organiza', 'invita', 'participa', 'info', 'footer'];

  constructor(public authService: AuthService) {}

  // Activa el modo snap al entrar en la pagina
  ngOnInit(): void {
    document.documentElement.classList.add('snap-page');
  }

  // Detecta la seccion visible al hacer scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset + window.innerHeight * 0.4;

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (element) {
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;

        if (scrollPosition >= top && scrollPosition <= bottom) {
          this.activeSection = section;
        }
      }
    }
  }

  // Hace scroll hasta la seccion elegida
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
