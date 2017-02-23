import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-user-profile',
  templateUrl: 'userprofile.component.html'
})
export class ManageUserComponent implements OnInit {
  errorMessage = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

  constructor(private authService: AuthService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private userService: UserService) {}

  formReset() {
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPass: ''
    };
    this.errorMessage = '';
  }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent().then(
        (data: any) => this.currentUser = <User> data,
        (error: any) => this.errorMessage = <any> error
      );
    }
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
      .then(
        (response: any) => {
          this.toasterService.pop('success', 'Success', this.getTranslatedString(response));
          this.formReset();
        }
      ).catch(
        (error: any) => {
          try {
            this.errorMessage = error.json()[''];
          } catch (e) {
            console.error(e);
          }
        }
      );
  }

  updateUserInfo() {
    this.userService.updateUserInfo(this.currentUser)
      .then(
        (response: any) => {
          this.toasterService.pop('success', 'Success', this.getTranslatedString(response));
        }
      ).catch(
        (error: any) => {
          try {
            this.errorMessage = error.json()[''];
          } catch (e) {
            console.error(e);
          }
        }
      );
  }

  getTranslatedString(data: any) {
    let translatedResponse = '';
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
