import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { EditStudentDetailsComponent } from './shared/edit-student-details/edit-student-details.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { StudentsComponent } from './students/students.component';
import { UploadPictureComponent } from './shared/upload-picture/upload-picture.component';
import { usersRouting } from './users.routing';
import { UserService } from './user.service';
import { UsersSorter } from './admin/pipes/sort.pipe';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
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
    StudentsComponent,
    UploadPictureComponent,
    UsersListComponent,
    UsersSorter
  ],
  providers: [
    AdminGuard,
    AuthGuard,
    UserService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class UsersModule {}
