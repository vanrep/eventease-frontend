import { Component, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { trigger, transition, style, animate, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0
          })
        ], { optional: true }),
        query(':enter', [
          animate('600ms ease-in-out', style({ opacity: 1 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  isInicio = false;
  isAuthPage = false;
  currentUrl = '';
  showFab = false;

  constructor(private router: Router) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.urlAfterRedirects || event.url;

      // Force scroll to top on every route change
      window.scrollTo(0, 0);

      this.isAuthPage = this.currentUrl === '/login' || this.currentUrl === '/register';

      // Show immersive footer on Inicio, Create Event, Event List, and Event Details pages
      this.isInicio = this.currentUrl === '/inicio' || this.currentUrl === '/' || 
                      this.currentUrl.includes('inicio') || this.currentUrl.includes('crear') ||
                      this.currentUrl.includes('/eventos');
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showFab = window.pageYOffset > 300;
  }

  scrollToTop() {
    // Native smooth scroll for instant response and reliability
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
