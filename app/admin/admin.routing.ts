import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminGuard } from '../core/guards/admin-guard';
import { AuthGuard } from '../core/guards/auth-guard';
import { EditUserComponent } from './edit-user/edit-user.component';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];

export const adminRouting: ModuleWithProviders = RouterModule.forChild(adminRoutes);
