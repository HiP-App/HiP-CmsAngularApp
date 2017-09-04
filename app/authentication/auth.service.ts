import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import * as auth0 from 'auth0-js';

import { AppComponent } from '../app.component';
import { AuthApiService } from '../shared/api/auth-api.service';
import { ConfigService } from '../config.service';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  listener: AppComponent;
  jwtHelper = new JwtHelper();
  auth0: auth0.WebAuth;

  constructor(private router: Router,
              private apiService: AuthApiService,
              private userService: UserService,
              private config: ConfigService) {
    this.auth0 = new auth0.WebAuth({
      clientID: this.config.get('authClientID'),
      domain: this.config.get('authDomain'),
      responseType: 'id_token token',
      audience: this.config.get('authAudience'),
      redirectUri: this.config.get('authRedirectUri'),
      scope: 'openid profile email read:webapi write:webapi read:datastore write:datastore read:featuretoggle write:featuretoggle'
    });
  }

  /**
   * Logs the User in and redirects to Dashboard
   * @param email Email of the User
   * @param password Password of the User
   * @returns {Promise<Error> || void} Returns a Subscription of the Login http call
   */
  login(email: string, password: string) {
    const options = {};
    this.auth0.authorize(options);
  }

  public handleAuthentication(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            this.setSession(authResult);
            this.router.navigateByUrl('/dashboard');
            resolve('success');
          } else if (err) {
            this.router.navigateByUrl('/login');
            reject(err);
          }
        });
      }
    );
  }

  private setSession(authResult: auth0.Auth0DecodedHash): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  /**
   * With this function a new User will be created
   * @param email Email of the User
   * @param password Password of the User
   * @param confirmPassword The confirmed Password of the User (should be the same as password)
   * @returns {Subscription} returns a Subscription of the signup http call
   */
  signup(email: string, password: string, confirmPassword: string) {
    const contentHeaders = new Headers();
    contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'Email=' + email + '&Password=' + password + '&ConfirmPassword=' + confirmPassword;

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
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // clear current User
    this.userService.clearSession();
    this.listener.onChange();
  }

  /**
   * checks if a token is available and its expire date
   * @returns {boolean} returns if the User is (still) logged in
   */
  isLoggedIn() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
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
