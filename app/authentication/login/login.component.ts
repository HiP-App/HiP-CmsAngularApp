import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router-deprecated';
import { CORE_DIRECTIVES, ControlGroup, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { Http, HTTP_PROVIDERS } from '@angular/http';

import { contentHeaders } from '../shared/headers';

@Component({
  selector: 'hip-login',
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: ['./app/authentication/shared/css/form-elements.css', './app/authentication/shared/css/style.css'],
  providers: [Http, HTTP_PROVIDERS]
})

export class LoginComponent {
  loginForm: ControlGroup;
  errorMessage: string;

  constructor(public router: Router, public http: Http, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(email: string, password: string) {

    let grant_type = 'password';
    let resource = 'http://localhost:5001/';
    let scope = 'offline_access profile email roles';

    let body = 'username=' + email + '&password=' + password + '&grant_type=' + grant_type + '&resource=' + resource + '&scope=' + scope;

    this.http.post('http://localhost:5001/connect/token', body, { headers: contentHeaders })
      .subscribe(
        response => {
          localStorage.setItem('jwt', response.json().access_token);
          console.log(response.json().access_token);
          this.router.parent.navigateByUrl('/dashboard');
        },
        error => {
          this.errorMessage = <any>error;
          console.log(error.text());
        });
  }
}
