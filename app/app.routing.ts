import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'annotation',
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

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
