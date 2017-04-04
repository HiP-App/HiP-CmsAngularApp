import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule } from 'ng2-translate';

import { usersRouting } from './users.routing';
import { AdminComponent } from './admin/admin.component';
import { EditStudentDetailsComponent } from './shared/edit-student-details/edit-student-details.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { SharedModule } from '../shared/shared.module';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { StudentsComponent } from './students/students.component';
import { UsersSorter } from './admin/pipes/sort.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    Ng2PaginationModule,
    ReactiveFormsModule,
    SharedModule,
    TagInputModule,
    TranslateModule,
    usersRouting
  ],
  declarations: [
    AdminComponent,
    EditStudentDetailsComponent,
    EditUserComponent,
    InviteUsersComponent,
    ManageUserComponent,
    UsersListComponent,
    StudentsComponent,
    UsersSorter,
  ]
})
export class UsersModule {}
