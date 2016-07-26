import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AuthGuard } from './shared/auth/auth-guard';
import { AuthService } from './shared/auth/auth.service';
import { ApiService } from './shared/api/api.service';
import { hipRouterProviders } from './app.routes';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { provide } from '@angular/core';

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  hipRouterProviders,
  HTTP_PROVIDERS,
  AuthGuard,
  AuthService,
  ApiService,
  provide(
    AuthHttp,
    {
      useFactory: (http: Http) => {
        return new AuthHttp(new AuthConfig({
          headerName: 'Authorization',
          headerPrefix: 'Bearer',
          tokenName: 'id_token',
          tokenGetter: (() => localStorage.getItem('id_token')),
          globalHeaders: [{'Content-Type': 'application/x-www-form-urlencoded'}],
          noJwtError: true,
          noTokenScheme: true
        }), http);
      },
      deps: [Http]
    })
]);


