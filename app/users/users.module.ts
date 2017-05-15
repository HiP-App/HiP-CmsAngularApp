import { NgModule } from '@angular/core';
import { TagInputModule } from 'ng2-tag-input';
import { NgxPaginationModule } from 'ngx-pagination';

import { usersRouting } from './users.routing';
import { AdminComponent } from './admin/admin.component';
import { EditStudentDetailsComponent } from './shared/edit-student-details/edit-student-details.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { ManageUserComponent } from './userprofile/userprofile.component';
import { SharedModule } from '../shared/shared.module';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { StudentsComponent } from './students/students.component';
import { UserService } from './user.service';
import { UsersSorter } from './admin/pipes/sort.pipe';

@NgModule({
  imports: [
    NgxPaginationModule,
    SharedModule,
    TagInputModule,
    usersRouting
  ],
  declarations: [
    AdminComponent,
    EditStudentDetailsComponent,
    EditUserComponent,
    InviteUsersComponent,
    ManageUserComponent,
    StudentsComponent,
    UsersListComponent,
    UsersSorter
  ],
  providers: [
    UserService
  ]
})
export class UsersModule {}
