import { Component } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ToasterService } from 'angular2-toaster';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'hip-userProfile',
  templateUrl: './app/userprofile/userprofile.component.html',
  styleUrls: ['./app/userprofile/userprofile.component.css']
})
export class ManageUserComponent {
  errorMessage: string = '';
  //waitingForResponse = false;

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: ''
  };

  constructor(private authService: AuthService, private toasterService: ToasterService) {
  }

  formReset() {
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPass: ''
    };
    this.errorMessage = '';
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword() {
    this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass)
      .then(response => {
        this.toasterService.pop('success', 'Success', response);
        this.formReset();
      })
      .catch(error => {
        try {
          this.errorMessage = error.json()[""];
        } catch (e) {}
      });
  }
}