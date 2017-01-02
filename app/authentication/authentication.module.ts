import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';

import { authRouting } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

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
export class AuthenticationModule {}
