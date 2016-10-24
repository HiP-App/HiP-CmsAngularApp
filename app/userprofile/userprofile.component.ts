import { Component } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup } from '@angular/forms';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user.model';
import { CmsApiService } from '../core/api/cms-api.service';


@Component({
  selector: 'hip-userProfile',
  templateUrl: './app/userprofile/userprofile.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class ManageUserComponent {
  errorMessage: string = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
  };

  constructor(private userService: UserService, private authService: AuthService, private toasterService: ToasterService) {
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
        (error: any) => this.errorMessage = <any> error
        );
    } 
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
    .then((response: any) => {
      this.toasterService.pop('success', 'Success', response);
      this.formReset();
    })
    .catch((error: any) => {
      try {
        this.errorMessage = error.json()[''];
      } catch (e) {}
    });
  }

  updateUserInfo(){
    this.userService.updateUserInfo(this.currentUser.firstName, this.currentUser.lastName)
    .then(response => {
      this.toasterService.pop('success', 'Success', response);
    })
    .catch(error => {
      try {
        this.errorMessage = error.json()[""];
      } catch (e) {}
    });
  }
}