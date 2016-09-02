import { Component } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'hip-login',
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: ['./app/authentication/shared/css/style.css']
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
