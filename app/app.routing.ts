import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'annotation',
    loadChildren: './tag-management/tag.module#TagModule',
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'feature-toggle',
    loadChildren: './feature-toggle/feature-toggle.module#FeatureToggleModule'
  },
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'mobile-content',
    loadChildren: './mobile-content/mobile-content.module#MobileContentModule'
  },
  {
    path: 'pages',
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: 'topics',
    loadChildren: './topics/topics.module#TopicModule'
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: '**',
    redirectTo: '/pages/error'
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
