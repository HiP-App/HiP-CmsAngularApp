import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { UserService } from './../user/user.service';
import { User } from '../user/user.model';
import { CmsApiService } from '../api/cms-api.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private cmsApiService: CmsApiService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.cmsApiService.getUrl('/api/Users/Current', {})
      .map(
        value => {
          if ((<User> value.json()).role === 'Administrator') {
            return true;
          } else {
            this.router.navigate(['/dashboard']);
            return false;
          }
        }
      ).catch(this.handleError);
    /*
     this.userService.getCurrent().then(
     user => {
     if (user.role === 'Administrator') {
     return true;
     } else {
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
     ); */
  }

  handleError(error: any) {
    console.log(error);
    this.router.navigate(['/dashboard']);
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
