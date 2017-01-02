import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { ManageUserComponent } from './userprofile.component';

const userRoutes: Routes = [
  {
    path: 'manage-profile',
    component: ManageUserComponent,
    canActivate: [AuthGuard]
  }
];

export const userProfileRouting: ModuleWithProviders = RouterModule.forChild(userRoutes);
