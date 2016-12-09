import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';
import { ManageUserComponent } from './userprofile.component';
import { AuthGuard } from '../core/guards/auth-guard';


const userRoutes: Routes = [
  {
    path: 'manage-profile',
    component: ManageUserComponent,
    canActivate: [AuthGuard]
  }
];

export const userProfileRouting: ModuleWithProviders = RouterModule.forChild(userRoutes);
