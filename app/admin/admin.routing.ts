import { AdminComponent } from './admin.component';
import { AuthGuard } from '../core/guards/auth-guard';
import { AdminGuard } from '../core/guards/admin-guard';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];

export const adminRouting: ModuleWithProviders = RouterModule.forChild(adminRoutes);