import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { UserService } from '../user/user.service';

@Injectable()
export class SupervisorGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getCurrent()
      .then(
        (user: any) => {
          if (user.role === 'Supervisor' || user.role === 'Administrator') {
            return true;
          } else {
            this.router.navigate(['/dashboard']);
            return false;
          }
        }
      ).catch(
        (error: any) => {
          console.error(error);
          this.router.navigate(['/dashboard']);
          return false;
        }
      );
  }
}
