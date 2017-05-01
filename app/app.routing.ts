import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from './core/guards/auth-guard';
import { AuthApiService } from './core/api/auth-api.service';
import { AuthService } from './core/auth/auth.service';
import { CmsApiService } from './core/api/cms-api.service';
import { SupervisorGuard } from './core/guards/supervisor-guard';
import { UserService } from './users/user.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/error'
  }
];

export const appRoutingProviders: any[] = [
  AuthService,
  AuthApiService,
  CmsApiService,
  UserService,
  AuthGuard,
  SupervisorGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
