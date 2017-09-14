import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { AuthService } from '../auth.service';

@Component({
  moduleId: module.id,
  selector: 'hip-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  waitingForResponse = false;

  constructor(private authService: AuthService,
              private router: Router) {
    let obs = IntervalObservable.create(100).subscribe(
      () => {
        if (authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
          obs.unsubscribe();
        }
      }
    );
  }

  loginUser() {
    this.waitingForResponse = true;
    this.authService.login();
  }
}
