import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../shared/guards/auth-guard';
import { NotificationsComponent } from './notifications.component';

const notificationRoutes: Routes = [
  {
    path: 'all',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  }
];

export const notificationRouting: ModuleWithProviders = RouterModule.forChild(notificationRoutes);
