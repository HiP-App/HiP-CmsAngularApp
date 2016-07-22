import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import {AUTH_PROVIDERS} from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AuthGuard } from './shared/auth/auth-guard';
import { AuthService } from './shared/auth/auth.service';
import { ApiService } from './shared/api/api.service';
import { hipRouterProviders } from './app.routes';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  hipRouterProviders,
  HTTP_PROVIDERS,
  AUTH_PROVIDERS,
  AuthGuard,
  AuthService,
  ApiService
]);
