import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { NotificationsComponent } from './notifications.component';

const notificationRoutes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
];

export const notificationRouting: ModuleWithProviders = RouterModule.forChild(notificationRoutes);
