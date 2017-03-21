import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../core/guards/admin-guard';
import { AuthGuard } from '../core/guards/auth-guard';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { StudentsComponent } from './students/students.component';
import { SupervisorGuard } from '../core/guards/supervisor-guard';

const usersRoutes: Routes = [
  {
    path: 'users',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'edit-user/:identity',
    component: EditUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'invite-users',
    component: InviteUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-profile',
    component: ManageUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [SupervisorGuard]
  },
];

export const usersRouting: ModuleWithProviders = RouterModule.forChild(usersRoutes);
