import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { ManageUserComponent } from './userprofile.component';
import { TranslateModule } from 'ng2-translate';
import { userProfileRouting } from './userprofile.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    userProfileRouting
  ],
  declarations: [
    ManageUserComponent
  ]
})
export class UserProfileModule {
}
