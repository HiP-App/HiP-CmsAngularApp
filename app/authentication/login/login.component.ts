import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';

import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'hip-login',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: ['./app/authentication/shared/css/style.css'],
  providers: [Http]
})

export class LoginComponent {
  errorMessage: string;
  user = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {
  }

  loginUser(email: string, password: string) {
    console.log(this.user);
    if (this.user.email === '' || this.user.password === '') {
      this.user = {
        email: email,
        password: password
      };
    }
    this.errorMessage = <any> this.authService.login(this.user.email, this.user.password);
  }
}
