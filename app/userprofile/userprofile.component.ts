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

  user = {
    oldPassword: '',
    newPassword: '',
    confirmPass: '',
    FirstName:  '',
    LastName: '',

  };

  constructor(private userService: UserService, private authService: AuthService, private toasterService: ToasterService) {
  }

  formReset() {
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPass: '',
      FirstName:  '',
      LastName: '',
    };
    this.errorMessage = '';
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
   this.userService.updateUserInfo(this.user.FirstName, this.user.LastName)
      .then(response => {
        this.toasterService.pop('success', 'Success', response);
        this.formReset();
        console.log(this.user.FirstName);
        console.log(this.user.LastName);
      })
      .catch(error => {
        try {
          this.errorMessage = error.json()[""];
        } catch (e) {}
      });
}


}