import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { TranslateModule } from 'ng2-translate';

import { ManageUserComponent } from './userprofile/userprofile.component';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { userRouting } from './user.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    userRouting,
    SharedModule
  ],
  declarations: [
    ManageUserComponent,
    InviteUsersComponent
  ]
})
export class UserModule {
}
