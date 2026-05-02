import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Inicia la aplicacion Angular usando el componente raiz y la configuracion global
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
