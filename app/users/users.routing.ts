import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { StudentsComponent } from './students/students.component';
import { SupervisorGuard } from '../shared/guards/supervisor-guard';

const usersRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard]
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
    canActivate: [AuthGuard]
  },
];

export const usersRouting: ModuleWithProviders = RouterModule.forChild(usersRoutes);
