import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';

import { CmsApiService } from '../../shared/api/cms-api.service';
import { CONFIG } from '../../config.constant';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(private cmsApiService: CmsApiService) {
  }

  private extractData(res: Response): User {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  getCurrent(): Promise<User> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'));
    headers.append('Resource', CONFIG['authSecret']);

    return this.cmsApiService.getUrl('/api/Users/Current', { headers })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
}
