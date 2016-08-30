import { ModuleWithProviders, provide, PLATFORM_PIPES } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthService } from './shared/auth/auth.service';
import { ApiService } from './shared/api/api.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CmsApiService } from './shared/api/cms-api.service';
import { UserService } from './shared/user/user.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
import { TRANSLATION_PROVIDERS } from './shared/translate/translations';
import { TranslateService, TranslatePipe } from 'ng2-translate';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

export const appRoutingProviders: any[] = [
  AuthService,
  ApiService,
  CmsApiService,
  UserService,
  TRANSLATION_PROVIDERS,
  TranslateService, // inject our services
  provide(PLATFORM_PIPES, { useValue: [TranslatePipe], multi: true }), // application wide pipe
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
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
