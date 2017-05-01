import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { AppComponent } from '../../app.component';
import { AuthApiService } from '../api/auth-api.service';
import { ConfigService } from '../../config.service';
import { UserService } from '../../users/user.service';

@Injectable()
export class AuthService {
  listener: AppComponent;
  jwtHelper = new JwtHelper();

  constructor(private router: Router,
              private apiService: AuthApiService,
              private userService: UserService,
              private config: ConfigService) {}

  /**
   * Logs the User in and redirects to Dashboard
   * @param email Email of the User
   * @param password Password of the User
   * @returns {Promise<Error> || void} Returns a Subscription of the Login http call
   */
  login(email: string, password: string) {
    let headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Access-Control-Allow-Origin', this.config.get('authUrl'));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let grantType = 'password';
    let scope = 'offline_access profile email';
    let resource = this.config.get('authSecret');

    let body = 'username=' + email + '&password=' + password + '&grant_type=' +
      grantType + '&resource=' + resource + '&scope=' + scope;

    return this.apiService.postUrl('/auth/login', body, { headers })
      .toPromise()
      .then(
        (response: any) => {
          localStorage.clear();
          localStorage.setItem('id_token', response.json().access_token);
          localStorage.setItem('expires_in', response.json().expires_in);
          localStorage.setItem('refresh_token', response.json().refresh_token);
          this.listener.onChange();
          this.router.navigateByUrl('/dashboard');
          return 'success';
        }
      ).catch(
        (error: any) => {
          console.error('Error service:' + error.text());
          return error;
        }
      );
  }

  /**
   * With this function a new User will be created
   * @param email Email of the User
   * @param password Password of the User
   * @param confirmPassword The confirmed Password of the User (should be the same as password)
   * @returns {Subscription} returns a Subscription of the signup http call
   */
  signup(email: string, password: string, confirmPassword: string) {
    let contentHeaders = new Headers();
    contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    let body = 'Email=' + email + '&Password=' + password + '&ConfirmPassword=' + confirmPassword;

    return this.apiService.postUrl('/auth/register', body, { headers: contentHeaders })
      .subscribe(
        (response: any) => {
          this.router.navigateByUrl('/login');
        },
        (error: any) => {
          console.error('Error service:' + error.text());
          return error;
        }
      );
  }

   /**
   * With this function the User is able to change his password
   * @param oldPassword Old Password of the User
   * @param newPassword New Password of the User
   * @param confirmPassword Repeated New Password of the User
   * @returns {Promise<string>} returns a Subscription of the signup http call
   */
  changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    let headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Access-Control-Allow-Origin', this.config.get('authUrl'));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let authToken = localStorage.getItem('id_token');
    headers.append('Authorization', `Bearer ${authToken}`);

    let body = 'OldPassword=' + oldPassword + '&NewPassword=' + newPassword + '&ConfirmPassword=' + confirmPassword;

    return this.apiService.putUrl('/auth/changePassword', body, { headers })
      .toPromise()
      .then(
        (response: any) => {
          if (response.status === 200) {
            return 'Password changed';
          }
        }
      );
  }

  /**
   * To be informed about changes to adjust the view, with this function a listener can be added.
   * @param _listener A ToolbarComponent which needs information when User changes
   */
  addListener(_listener: AppComponent) {
    this.listener = _listener;
  }

  /**
   * This function logs the User out
   */
  logout() {
    // clear local storage
    localStorage.clear();
    // clear current User
    this.userService.clearSession();
    this.listener.onChange();
  }

  /**
   * checks if a token is available and its expire date
   * @returns {boolean} returns if the User is (still) logged in
   */
  isLoggedIn() {
    return tokenNotExpired();
  }

  /**
   * Use this function to get the Users email, without importing the UserModule
   * @returns {string|string|any} If the User is logged in, it returns a String which contains the email of the
   * current User
   */
  getUserEmail() {
    let decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));
    return decodedToken.email;
  }
}
