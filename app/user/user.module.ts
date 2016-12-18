import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { TagInputModule } from 'ng2-tag-input';

import { TranslateModule } from 'ng2-translate';

import { ManageUserComponent } from './userprofile/userprofile.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { userRouting } from './user.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    userRouting,
    TagInputModule,
  ],
  declarations: [
    ManageUserComponent,
    InviteUsersComponent,
  ]
})
export class UserModule {
}
