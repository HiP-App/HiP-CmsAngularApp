import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from './shared/guards/auth-guard';
import { AuthApiService } from './shared/api/auth-api.service';
import { AuthService } from './authentication/auth.service';
import { CmsApiService } from './shared/api/cms-api.service';
import { FeatureToggleApiService } from './shared/api/featuretoggle-api.service';
import { OOApiService } from './shared/api/oo-api.service';
import { SupervisorGuard } from './shared/guards/supervisor-guard';
import { UserService } from './users/user.service';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'annotations',
    loadChildren: 'app/tag-management/tag.module#TagModule',
  },
  {
    path: 'dashboard',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'feature-toggle',
    loadChildren: 'app/feature-toggle/feature-toggle.module#FeatureToggleModule'
  },
  {
    path: 'notifications',
    loadChildren: 'app/notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'mobile-content',
    loadChildren: 'app/mobile-content/mobile-content.module#MobileContentModule'
  },
  {
    path: 'pages',
    loadChildren: 'app/pages/pages.module#PagesModule'
  },
  {
    path: 'topics',
    loadChildren: 'app/topics/topics.module#TopicModule'
  },
  {
    path: 'users',
    loadChildren: 'app/users/users.module#UsersModule'
  },
  {
    path: '**',
    redirectTo: '/pages/error'
  },
];

export const appRoutingProviders: any[] = [
  AuthApiService,
  AuthGuard,
  AuthService,
  CmsApiService,
  FeatureToggleApiService,
  OOApiService,
  UserService,
  SupervisorGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
