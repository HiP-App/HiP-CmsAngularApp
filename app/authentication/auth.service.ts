import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import * as auth0 from 'auth0-js';

import { AppComponent } from '../app.component';
import { ConfigService } from '../config.service';
import { UserService } from '../users/user.service';

export let errCode = 0;

@Component({
  moduleId: module.id,
  selector: 'hip-login',
  templateUrl: './login/login.component.html',
  styleUrls: ['./login/login.component.css']
})

@Injectable()
export class AuthServiceComponent {
  listener: AppComponent;
  jwtHelper = new JwtHelper();
  auth0: auth0.WebAuth;
  message: string;
  flag: number;

  public static readonly ERR_ACCOUNT_NOT_ENABLED = 'ACCOUNT_NOT_ENABLED';
  public static readonly ERR_EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED';

  constructor(private router: Router,
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
   * Opens auth0 login page and redirects to Dashboard.
   *
   * @returns {Promise<Error> || void} Returns a Subscription of the Login http call
   */
   public login(username: string, password: string): void {
    const options = {};
    errCode = 0;
    this.auth0.client.login ({realm: 'Username-Password-Authentication', username, password}, (err, authResult) => {
      // Email not verified
      if (err && err.statusCode === 401) {
        errCode = 401;
      } else if (err && err.statusCode === 400) {
        errCode = 400; // Username or password required
      } else if (err && err.statusCode === 429) {
        errCode = 429; // Too many failed login attempts
      } else if (err && err.statusCode === 403) {
        errCode = 403; // Invalid username or password
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult); // Access granted
      } else {
        return;
      }});
  }

  public auth0Lock() {
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
    window.location.replace('/dashboard');
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
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

    // clear current user
    this.userService.clearSession();
    this.listener.onChange();
  }

  /**
   * Checks if a token is available and its expire date.
   *
   * @returns {boolean} returns if the User is (still) logged in
   */
  isLoggedIn() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  /**
   * Returns the email of the user currently logged in.
   *
   * @returns {string|any} the email of the current user if the user is logged in
   */
  getUserEmail() {
    let decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));
    return decodedToken.email;
  }
}
