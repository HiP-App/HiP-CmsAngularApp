import { Component } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { Response } from '@angular/http';

@Component({
  selector: 'hip-login',
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: ['./app/authentication/shared/css/style.css']
})

export class LoginComponent {
  errorMessage: string;
  waitingForResponse = false;
  user = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {
  }

  loginUser(email: string, password: string) {
    this.waitingForResponse = true;
    if (this.user.email === '' || this.user.password === '') {
      this.user = {
        email: email,
        password: password
      };
    }
    let response: Promise<Response> = <any> this.authService.login(this.user.email, this.user.password);
    response.then(
      (error: any) => {
        try {
          this.errorMessage = error.json().error;
        } catch (e) {
          // seems login was successful then
        }
        this.waitingForResponse = false;
      }
    );
  }
}
