import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { AuthGuard } from '../core/guards/auth-guard';

const userRoutes: Routes = [
  {
    path: 'manage-profile',
    component: ManageUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'invite-users',
    component: InviteUsersComponent,
    canActivate: [AuthGuard]
  }
];

export const userRouting: ModuleWithProviders = RouterModule.forChild(userRoutes);
