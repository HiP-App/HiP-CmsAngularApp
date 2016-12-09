import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthService } from './core/auth/auth.service';
import { CmsApiService } from './core/api/cms-api.service';
import { UserService } from './core/user/user.service';
import { AuthHttp, provideAuth } from 'angular2-jwt';
import { AuthGuard } from './core/guards/auth-guard';
import { SupervisorGuard } from './core/guards/supervisor-guard';
import { AuthApiService } from './core/api/auth-api.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

export const appRoutingProviders: any[] = [
  AuthService,
  AuthApiService,
  CmsApiService,
  UserService,
  AuthGuard,
  SupervisorGuard,
  AuthHttp,
  provideAuth({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'id_token',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{'Content-Type': 'application/x-www-form-urlencoded'}],
    noJwtError: true,
    noTokenScheme: true
  })
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
