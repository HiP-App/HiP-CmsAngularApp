import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AuthServiceComponent } from '../../authentication/auth.service';
import { NotificationService } from '../../notifications/notification.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-user-profile',
  styleUrls: ['userprofile.component.css'],
  templateUrl: 'userprofile.component.html'
})
export class ManageUserComponent implements OnInit {
  errorMessage = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;

  notificationTypes: string[];
  subscribedTypes: string[];

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

  constructor(private authService: AuthServiceComponent,
    private notificationService: NotificationService,
    private toasterService: ToasterService,
    private translateService: TranslateService,
    private userService: UserService) { }

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
      this.userService.getCurrent()
        .then(
        (data: any) => {
          this.currentUser = <User>data;
        },
        (error: any) => this.errorMessage = <any>error
        );
    }

    this.notificationService.getTypes()
      .then(
      response => this.notificationTypes = response
      ).catch(
      error => this.toasterService.pop('error', this.getTranslatedString('Error fetching notification types'), error)
      );

    this.notificationService.getSubscribedTypes()
      .then(
      response => this.subscribedTypes = response
      ).catch(
      error => this.toasterService.pop('error', this.getTranslatedString('Error fetching subscriptions'), error)
      );
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  updateSubscription(event: MdCheckboxChange, type: string) {
    if (event.checked) {
      this.notificationService.subscribeType(type);
    } else {
      this.notificationService.unsubscribeType(type);
    }
  }

  updateUserInfo() {
    this.userService.updateUser(this.currentUser)
      .then(
      (response: any) => {
        this.toasterService.pop('success', this.getTranslatedString('Information successfully updated'));
      }
      ).catch(
      (error: any) => {
        try {
          this.errorMessage = error;
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
