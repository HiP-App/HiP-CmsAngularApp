import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { AuthServiceComponent } from '../auth.service';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { errCode } from '../auth.service';

@Component({
  moduleId: module.id,
  selector: 'hip-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  waitingForResponse = false;
  flag = false;
  message: String;
  v: String;

  constructor(private authService: AuthServiceComponent,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
    let obs = IntervalObservable.create(100).subscribe(
      () => {
        if (authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
          obs.unsubscribe();
        }
      }
    );
  }

  loginUser(username: string, password: string) {
    this.waitingForResponse = true;
    let v = this.authService.login(username, password);
    // This method executes after the async operation is complete
    setTimeout(() => {
      if (errCode === 403) {
        this.toasterService.pop('error', this.translate('Invalid username or password!'));
      } else if (errCode === 400) {
        this.toasterService.pop('error', this.translate('Username and password required!'));
      } else if (errCode === 401) {
        this.toasterService.pop('error', this.translate('Email not verified!'));
      } else if (errCode === 429) {
        this.toasterService.pop('error', this.translate('Too many failed login attempts, your account is blocked!'));
      }
    }, 500);
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  alternateLogin() {
      this.authService.auth0Lock();
  }
}
