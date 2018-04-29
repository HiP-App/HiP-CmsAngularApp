import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../../users/user.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
    moduleId: module.id,
    selector: 'hip-signup',
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnDestroy {
    waitingForResponse = false;
    flag = false;
    message: String;
    v: String;
    observableVar: any;

    constructor(private userService: UserService,
        private router: Router,
        private toasterService: ToasterService,
        private translateService: TranslateService) {
        let context = this;
        /*this.observableVar = IntervalObservable.create(500).subscribe(
        (x: any) => {
            context.router.navigateByUrl('/login');
        }
        );*/
    }

    ngOnDestroy() {
        this.observableVar.unsubscribe();
      }

    signupUser(event: Event, email: string, firstname: string, lastname: string, password: string) {
        event.preventDefault();
        this.waitingForResponse = true;
        this.userService.createUser(email, firstname, lastname, password).then(() => {
          window.location.hash = '';
        }).then(() => {
          this.router.navigateByUrl('/login');
        }).catch(err => {
          let errCode = err.statusCode;
          console.log("There's an error " + err);
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
}
