import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router-deprecated';
import { CORE_DIRECTIVES, Control, ControlGroup, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';

import { contentHeaders } from '../shared/headers';

@Component({
  selector: 'login',
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './app/authentication/login/login.component.html',
  styleUrls: ['./app/authentication/shared/css/form-elements.css', './app/authentication/shared/css/style.css'],
  providers: [Http, HTTP_PROVIDERS]
})

export class LoginComponent {
    loginForm: ControlGroup;

  constructor(public router: Router, public http: Http, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['',Validators.required], 
      password: ['',Validators.required],
    });
  }

  login(email:string, password:string) {

    var grant_type = 'password';
    var resource = "http://localhost:5001/";
    var scope = "offline_access profile email roles";

    let body = "username=" + email + "&password=" + password + "&grant_type=" + grant_type + "&resource=" + resource + "&scope=" + scope;
 
    this.http.post('http://localhost:5001/connect/token', body, { headers: contentHeaders })
      .subscribe(
      response => {
        localStorage.setItem('jwt', response.json().access_token);
        console.log(response.json().access_token);
        this.router.parent.navigateByUrl('/dashboard');
      },
      error => {
        alert(error.text());
        console.log(error.text());
      });
  }
}
