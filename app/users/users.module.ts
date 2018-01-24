import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule, MdSelectModule } from '@angular/material';
import { TagInputModule } from 'ngx-chips';
import { TranslateModule } from 'ng2-translate';

import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { CmsApiService } from '../shared/api/cms-api.service';
import { UserStoreApiService } from '../shared/api/userstore-api.service';
import { EditStudentDetailsComponent } from './shared/edit-student-details/edit-student-details.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { SharedPaginationModule } from '../shared/shared-pagination.module';
import { StudentsComponent } from './students/students.component';
import { UploadPictureComponent } from './shared/upload-picture/upload-picture.component';
import { usersRouting } from './users.routing';
import { UserService } from './user.service';
import { UsersSorter } from './admin/pipes/sort.pipe';
import { AuthServiceComponent } from '../authentication/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
    SharedPaginationModule,
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
    CmsApiService,
    UserStoreApiService,
    UserService,
    AuthServiceComponent
  ]
})
export class UsersModule {}
