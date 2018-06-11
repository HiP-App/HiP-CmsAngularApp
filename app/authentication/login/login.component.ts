import { Component, OnDestroy, HostListener } from '@angular/core';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Router } from '@angular/router';

import { AuthServiceComponent } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  waitingForResponse = false;
  flag = false;
  message: String;
  v: String;
  observableVar: any;

  constructor(private authService: AuthServiceComponent,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private spinnerService: NgxSpinnerService) {
    let context = this;
      this.observableVar =  IntervalObservable.create(500).subscribe(
        (x: any) => {
          if (authService.isLoggedIn()) {
            context.router.navigateByUrl('/dashboard');
          }
        }
      );
  }

  @HostListener('document:keyup', ['$event'])
  handleEnterKeyboardEvent(event: KeyboardEvent) {
    if( event.key === 'Enter' ) {
     let element: HTMLElement = document.getElementById('login-button') as HTMLElement;
     element.click();
    }
  }

  ngOnDestroy() {
    this.observableVar.unsubscribe();
    this.spinnerService.hide();
  }

  loginUser(event: Event, username: string, password: string) {
    event.preventDefault();
    this.spinnerService.show();
    this.waitingForResponse = true;
    this.authService.login(username, password).then(() => {
      window.location.hash = '';
    }).then(() => {
      this.spinnerService.hide();
      this.router.navigateByUrl('/dashboard');
    }).catch(err => {
      this.spinnerService.hide();
      let errCode = err.statusCode;
      if (errCode === 403) {
        this.toasterService.pop('error', this.translate('Invalid username or password!'));
      } else if (errCode === 400) {
        this.toasterService.pop('error', this.translate('Username and password required!'));
      } else if (errCode === 401) {
        this.toasterService.pop('error', this.translate('Email not verified!'));
      } else if (errCode === 429) {
        this.toasterService.pop('error', this.translate('Too many failed login attempts, your account is blocked!'));
      } else {
        console.error(err);
      }
    });
    return false;
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
