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
  auth01: auth0.Authentication;
  auth0Error: auth0.Auth0Error;
  auth0CallBack: auth0.Auth0Callback<any>;
  message: string;
  flag: number;
  result: any;

  public static readonly ERR_ACCOUNT_NOT_ENABLED = 'ACCOUNT_NOT_ENABLED';
  public static readonly ERR_EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED';

  constructor(private router: Router,
              private userService: UserService,
              private config: ConfigService) {
    this.auth0 = new auth0.WebAuth({
      clientID: this.config.get('authClientID'),
      domain: this.config.get('authDomain'),
      responseType: 'https://hip.eu.auth0.com/api/v2/',
      audience: this.config.get('authAudience'),
      redirectUri: this.config.get('authRedirectUri'),
      scope: 'openid profile email read:webapi write:webapi read:datastore write:datastore read:featuretoggle write:featuretoggle'
    }
  );
    this.auth01 = new auth0.Authentication({
      clientID: 'Ef2e9X6LFSFFe5dTdXD870E6EjEjzEr6',
      domain: this.config.get('authDomain'),
      responseType: 'access_token token',
      audience: 'https://hip.cs.upb.de/API',
      redirectUri: 'http://localhost:8080/login',
      // scope: 'openid profile email read:webapi write:webapi read:datastore write:datastore read:featuretoggle write:featuretoggle'
    }
  );
  // this.auth0CallBack = (this.auth0Error, this.result);
  }

  /**
   * Opens auth0 login page and redirects to Dashboard.
   *
   * @returns {Promise<Error> || void} Returns a Subscription of the Login http call
   */
  public login(username: string, password: string): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.auth0.client.login ({realm: 'Username-Password-Authentication', username, password}, (err, authResult) => {
          // Email not verified
          if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult); // Access granted
            this.listener.onChange();
            resolve('success');
          } else {
            this.router.navigateByUrl('/login');
            reject(err);
          }});
      }
    );
  }

  public auth0Lock() {
    const options = {};
    this.auth0.authorize(options);
  }

  public signup(email: string, firstname: string, lastname: string, password: string) {
    const grantType = 'client_credentials';
    const clientID = 'Ef2e9X6LFSFFe5dTdXD870E6EjEjzEr6';
    const clientSecret = '3cq1cHxRRQTu6LJhPiW-Ux-GCRm6nuBQiE9K_iyyNpQqop6h5z-0I90GFpYP-y8N';
    const audience = 'https://hip.cs.upb.de/API';
    const userMetadata = {firstname, lastname};
    const options = {clientID, clientSecret, audience, grantType};
    const callbackuri = 'http://localhost:8080/login';

    console.log('Reached Here');

    this.auth01.oauthToken(options, (err, authResult) => {
      // Email not verified
      if (authResult) {
        this.router.navigateByUrl('/login');
        console.log('AccessToken 2', authResult.accessToken);
      } else {
        console.log('ERROR in signup auth.service');
        this.router.navigateByUrl('/login');
      }});

      // this.userService.createUser(email, firstname, lastname, password);
  }

  public handleAuthentication(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
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
