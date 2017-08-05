import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from './shared/guards/auth-guard';
import { AuthApiService } from './shared/api/auth-api.service';
import { AuthService } from './authentication/auth.service';
import { CmsApiService } from './shared/api/cms-api.service';
import { FeatureToggleApiService } from './shared/api/featuretoggle-api.service';
import { SupervisorGuard } from './shared/guards/supervisor-guard';
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
  FeatureToggleApiService,
  UserService,
  AuthGuard,
  SupervisorGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
