import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { UserService } from './../user/user.service';

@Injectable()
export class SupervisorGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.userService.getCurrent().then(
      user => {
        if (user.role === 'Supervisor') {
          return true;
        } else {
          console.log('ELSE');
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
    ).catch(
      error => {
        console.log(error);
        this.router.navigate(['/dashboard']);
        return false;
      }
    );
  }
}
