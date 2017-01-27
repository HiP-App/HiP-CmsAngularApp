import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { ErrorPageComponent } from './error-page/error-page.component';

const sharedRoutes: Routes = [
  {
    path: 'error',
    component: ErrorPageComponent
  }
];

export const sharedRouting: ModuleWithProviders = RouterModule.forChild(sharedRoutes);
