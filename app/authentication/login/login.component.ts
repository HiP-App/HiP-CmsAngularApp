import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CORE_DIRECTIVES, ControlGroup, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { Http } from '@angular/http';

import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'hip-login',
  directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: [
    './app/authentication/shared/css/form-elements.css',
    './app/authentication/shared/css/style.css'
  ],
  providers: [Http]
})

export class LoginComponent {
  loginForm: ControlGroup;
  errorMessage: string;

  constructor(private authService: AuthService, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(email: string, password: string) {
    this.errorMessage = <any> this.authService.login(email, password);
    console.log(this.authService.login(email, password));
  }
}
