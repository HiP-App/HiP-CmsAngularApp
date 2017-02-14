import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/user/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['../shared/css/style.css']
})
export class SignupComponent implements OnInit {
  errorMessage = '';
  userCantEditEmail = false;
  user = {
    email: '',
    password: '',
    password2: ''
  };

  constructor(private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    let getQueryParameters = <any>this.route.snapshot.queryParams;
    if (getQueryParameters.email) {
      this.user.email = getQueryParameters.email;
      this.userCantEditEmail = true;
    }
  }

  isEmailValid() {
    return User.validateEmail(this.user.email);
  }

  isPasswordValid() {
    return this.user.password.match(/(?=^.{6,255}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d\s:])(?!.*\s).*/);
  }

  signupUser() {
    this.errorMessage = <any>this.authService.signup(this.user.email, this.user.password, this.user.password2);
  }
}
