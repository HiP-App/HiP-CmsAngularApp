import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';
import { BrowserModule } from '@angular/platform-browser';

import { ManageUserComponent } from './userprofile/userprofile.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { userRouting } from './user.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    userRouting,
    TagInputModule,
    SharedModule,
  ],
  declarations: [
    ManageUserComponent,
    InviteUsersComponent,
  ]
})
export class UserModule {
}
