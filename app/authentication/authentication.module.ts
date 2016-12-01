import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { authRouting } from './authentication.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    authRouting
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ]
})
export class AuthenticationModule {
}
