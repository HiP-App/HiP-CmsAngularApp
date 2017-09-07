import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdIconModule, MdInputModule } from '@angular/material';
import { AuthHttp, provideAuth } from 'angular2-jwt';
import { TranslateModule } from 'ng2-translate';

import { AuthApiService } from '../shared/api/auth-api.service';
import { AuthService } from './auth.service';
import { authRouting } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserService } from '../users/user.service';

@NgModule({
  imports: [
    authRouting,
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    TranslateModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [
    AuthApiService,
    AuthService,
    AuthHttp,
    provideAuth({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'access_token',
      tokenGetter: (() => localStorage.getItem('access_token')),
      globalHeaders: [{'Content-Type': 'application/json'}],
      noJwtError: true,
      noTokenScheme: true
    }),
    UserService
  ]
})
export class AuthenticationModule {}
