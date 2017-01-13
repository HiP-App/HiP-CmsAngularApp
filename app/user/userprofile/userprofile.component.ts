import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'hip-user-profile',
  templateUrl: 'userprofile.component.html',
  styleUrls: ['userprofile.component.css']
})
export class ManageUserComponent implements OnInit {
  errorMessage: string = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;
  translatedResponse: any;

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

  constructor(private userService: UserService,
              private authService: AuthService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

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
    this.userService.updateUserInfo(this.currentUser.firstName, this.currentUser.lastName)
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
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
