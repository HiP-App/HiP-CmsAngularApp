import { Component } from '@angular/core';
import { Response } from '@angular/http';

import { AuthService } from '../auth.service';
import { User } from '../../users/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-login',
  templateUrl: 'login.component.html',
  styleUrls: ['../shared/css/style.css']
})
export class LoginComponent {
  errorMessage: string;
  waitingForResponse = false;
  user = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  isEmailValid() {
    return User.validateEmail(this.user.email);
  }

  loginUser() {
    this.waitingForResponse = true;
    this.authService.login(this.user.email, this.user.password);
  }
}
