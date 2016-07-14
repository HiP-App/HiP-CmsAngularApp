import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';

import { ApiService } from '../api/api.service';
import { CONFIG } from '../../config.constant';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Injectable()
export class AuthService {
  listener: ToolbarComponent;
  loggedIn = false;

  constructor(private router: Router, private apiService: ApiService) {
    this.loggedIn = !!localStorage.getItem('id_token');
  }

  login(email: string, password: string) {
    let headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Access-Control-Allow-Origin', CONFIG['authUrl']);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let grant_type = 'password';
    let scope = 'offline_access profile email sroles';
    let resource = CONFIG['authSecret'];

    let body = 'username=' + email + '&password=' + password + '&grant_type=' +
      grant_type + '&resource=' + resource + '&scope=' + scope;

    return this.apiService
      .postUrl(
        '/connect/token',
        body,
        { headers }
      ).subscribe(
        response => {
          localStorage.setItem('id_token', response.json().access_token);
          this.loggedIn = true;
          this.listener.onChange();
          this.router.navigateByUrl('/dashboard');
        },
        error => {
          console.log('Error service:' + error.text());
          return error;
        }
      );
  }

  signup(email: string, password: string, confirmPassword: string) {
    let contentHeaders = new Headers();
    contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    let body = 'Email=' + email + '&Password=' + password + '&ConfirmPassword=' + confirmPassword;
    console.log('Body is:' + body);

    return this.apiService
      .postUrl('/auth/register', body, { headers: contentHeaders })
      .subscribe(
        response => {
          console.log('status code:' + response.status);
          console.log(response);
          this.router.navigateByUrl('/login');
        },
        error => {
          console.log('Error service:' + error.text());
          return error;
        });
  }

  addListener(_listener: ToolbarComponent) {
    this.listener = _listener;
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.clear();
    this.loggedIn = false;
    this.listener.onChange();
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
