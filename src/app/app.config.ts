import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const API_URL = 'http://localhost:5000';
// export const API_URL = 'https://mygate-q98s.onrender.com';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
