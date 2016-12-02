import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'hip-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['../shared/css/style.css']
})
export class SignupComponent implements OnInit {
  errorMessage: string = '';
  getQueryParameters: any;
  userCantEditEmail: boolean = false;

  user = {
    email: '',
    password: '',
    password2: ''
  };

  constructor(private authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getQueryParameters = <any>this.route.snapshot.queryParams;
    if (this.getQueryParameters.email) {
      this.user.email = this.getQueryParameters.email;
      this.userCantEditEmail = true;
    }
  }

  passwordValid() {
    return this.user.password.match(/(?=^.{6,255}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*/);
  }

  signupUser() {
    this.errorMessage = <any>this.authService.signup(this.user.email, this.user.password, this.user.password2);
  }
}


