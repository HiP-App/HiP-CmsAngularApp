import { Component } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { EqualValidatorDirective } from './equal-validator.directive';

@Component({
  selector: 'hip-signup',
  directives: [EqualValidatorDirective],
  templateUrl: './app/authentication/signup/signup.component.html',
  styleUrls: ['./app/authentication/shared/css/style.css']

})
export class SignupComponent {
  errorMessage: string = '';

  user = {
    email: '',
    password: '',
    password2: ''
  };

  constructor(private authService: AuthService) {
  }

  passwordValid() {
    return this.user.password.match(/(?=^.{6,255}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*/);
  }

  signupUser() {
    this.errorMessage = <any>this.authService.signup(this.user.email, this.user.password, this.user.password2);
  }
}


