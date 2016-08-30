import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';

import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'hip-login',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: [
    './app/authentication/shared/css/form-elements.css',
    './app/authentication/shared/css/style.css'
  ],
  providers: [Http]
})

export class LoginComponent {
  errorMessage: string;
  email: string;
  password: string;

  constructor(private authService: AuthService) {
  }

  login() {
    this.errorMessage = <any> this.authService.login(this.email, this.password);
  }
}
