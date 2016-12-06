import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { AuthService } from '../core/auth/auth.service';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user.model';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-user-profile',
  templateUrl: './app/userprofile/userprofile.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class ManageUserComponent implements OnInit {
  errorMessage: string = '';
  loggedIn: boolean;
  translatedResponse: any;
  getTranslatedData: any;
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };
  private currentUser: User = User.getEmptyUser();

  constructor(private userService: UserService,
              private authService: AuthService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

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
        (error: any) => this.errorMessage = <any> error.error
      );
    }
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
      .then((response: any) => {
        this.getTranslatedData = this.translatedData(response);
        this.toasterService.pop('success', 'Success', this.translatedResponse);
        this.formReset();
      })
      .catch((error: any) => {
        try {
          this.errorMessage = error.json()[''];
        } catch (e) {
        }
      });
  }

  updateUserInfo() {
    this.userService.updateUserInfo(this.currentUser.firstName, this.currentUser.lastName)
      .then(response => {
        this.getTranslatedData = this.translatedData(response);
        this.toasterService.pop('success', 'Success', this.translatedResponse);
      })
      .catch(error => {
        this.errorMessage = error.error;
      });
  }

  translatedData(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
