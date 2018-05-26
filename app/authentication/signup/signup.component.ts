import { Signup } from './../shared/signup.model';
import { AuthServiceComponent } from './../auth.service';
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
        private translateService: TranslateService,
        private authService: AuthServiceComponent) {
        let context = this;
        this.observableVar =  IntervalObservable.create(500).subscribe(
          (x: any) => {
            if (authService.isLoggedIn()) {
              context.router.navigateByUrl('/dashboard');
            }
          }
        );
    }

    ngOnDestroy() {
        this.observableVar.unsubscribe();
      }

    public signupUser(event: Event, email: string, firstname: string, lastname: string, password: string) {
        event.preventDefault();
        this.waitingForResponse = true;
        this.authService.getAccessToken()
        .then(() => {
          this.userService.createUser(email, firstname, lastname, password)
          .then(() => {
            window.location.hash = '';
            this.router.navigateByUrl('/login');
          })
          .catch(err => {
            this.toasterService.pop('error', this.translateService.instant('error signingup new user!'));
          });
        })
        .catch(err => {
          let errCode = err.statusCode;
          this.toasterService.pop('error', this.translate('Something went wrong!'));
          console.error(err);
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
