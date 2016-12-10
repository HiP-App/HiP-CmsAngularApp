import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';

import { InviteUsersComponent } from './invite-users.component';

const inviteUsersRoutes: Routes = [
  {
    path: 'invite',
    component: InviteUsersComponent,
  },
];

export const inviteUsersRouting: ModuleWithProviders = RouterModule.forChild(inviteUsersRoutes);