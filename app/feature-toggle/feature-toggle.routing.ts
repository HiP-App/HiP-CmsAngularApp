import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { FeatureToggleComponent } from './feature-toggle.component';

const featureToggleRoutes: Routes = [
  {
    path: 'feature-toggle',
    component: FeatureToggleComponent,
    canActivate: [AuthGuard]
  },
];

export const FeatureToggleRouting: ModuleWithProviders = RouterModule.forChild(featureToggleRoutes);
