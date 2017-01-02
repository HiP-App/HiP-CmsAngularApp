import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { userProfileRouting } from './userprofile.routing';
import { ManageUserComponent } from './userprofile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    userProfileRouting
  ],
  declarations: [
    ManageUserComponent
  ]
})
export class UserProfileModule {}
