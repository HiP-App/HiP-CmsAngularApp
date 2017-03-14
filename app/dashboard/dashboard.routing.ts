import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';

import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
];

export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);
