import { Component } from '@angular/core';
import { CORE_DIRECTIVES, ControlGroup, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { Http } from '@angular/http';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../shared/auth/auth.service';
import { CustomValidatorSignup } from './custom-validator-signup';

@Component({
  selector: 'hip-signup',
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './app/authentication/signup/signup.component.html',
  styleUrls: [
    './app/authentication/shared/css/form-elements.css',
    './app/authentication/shared/css/style.css'
  ],
  providers: [Http]

})
export class SignupComponent {
  errorMessage: string;
  registrationForm: ControlGroup;
  isError: boolean = false;

  constructor(private authService: AuthService, public formBuilder: FormBuilder) {
    this.registrationForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*'),
        CustomValidatorSignup.minPasswordLength
      ])],
      confirmPassword: ['', Validators.required]
    });
  }

  onclick(password: any, confirmPassword: any) {
    if (password.value !== confirmPassword.value) {
      this.isError = true;
    } else {
      this.isError = false;
    }
  }

  signup(email: string, password: string, confirmPassword: string) {
    this.authService.signup(email, password, confirmPassword);
  }
}


