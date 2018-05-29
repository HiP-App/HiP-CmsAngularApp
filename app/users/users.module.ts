import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdDialogModule, MdCheckboxModule,
  MdIconModule, MdInputModule, MdSelectModule } from '@angular/material';
import { TagInputModule } from 'ngx-chips';
import { TranslateModule } from 'ng2-translate';

import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { AuthServiceComponent } from './../authentication/auth.service';
import { CmsApiService } from '../shared/api/cms-api.service';
import { EditStudentDetailsComponent } from './shared/edit-student-details/edit-student-details.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { SharedPaginationModule } from '../shared/shared-pagination.module';
import { StudentsComponent } from './students/students.component';
import { UserProfileCardComponent } from './shared/user-profile-card/user-profile-card.component';
import { UploadPictureDialogComponent } from './shared/upload-picture-dialog/upload-picture-dialog.component';
import { usersRouting } from './users.routing';
import { UserService } from './user.service';
import { UsersSorter } from './admin/pipes/sort.pipe';
import { UserStoreApiService } from '../shared/api/userstore-api.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
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
    UserProfileCardComponent,
    UploadPictureDialogComponent,
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
  ],
  entryComponents: [
    UploadPictureDialogComponent
  ]
})
export class UsersModule { }
