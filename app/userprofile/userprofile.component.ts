import { Component } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { Response } from '@angular/http';


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

  constructor(private authService: AuthService) {
  }

  passwordValid() {
    return this.user.confirmPass.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/);
  }

  changePassword2() {
  this.errorMessage = <any>this.authService.changePassword(this.user.oldPassword, this.user.newPassword, this.user.confirmPass);
 // this.waitingForResponse = true;
  this.then(response => { this.errorMessage = response.json(); console.log(this.errorMessage)})

  } 
}