import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Habilita fetch para HttpClient
    provideRouter([]) // Configuración del enrutador (si es necesario)
  ]
}).catch(err => console.error(err));
