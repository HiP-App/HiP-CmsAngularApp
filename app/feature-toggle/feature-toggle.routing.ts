import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { FeatureToggleComponent } from './feature-toggle.component';

const featureToggleRoutes: Routes = [
  {
    path: '',
    component: FeatureToggleComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];

export const featureToggleRouting: ModuleWithProviders = RouterModule.forChild(featureToggleRoutes);
