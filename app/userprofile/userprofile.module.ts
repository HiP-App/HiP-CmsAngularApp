import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { TranslateModule } from 'ng2-translate';

import { ManageUserComponent } from './userprofile.component';
import { userProfileRouting } from './userprofile.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    userProfileRouting,
    SharedModule
  ],
  declarations: [
    ManageUserComponent
  ]
})
export class UserProfileModule {
}
