import { NgModule } from '@angular/core';
import { AuthHttp, provideAuth } from 'angular2-jwt';

import { AuthService } from './auth.service';
import { authRouting } from './authentication.routing';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [
    SharedModule,
    authRouting
  ],
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  providers: [
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
    })
  ]
})
export class AuthenticationModule {}
