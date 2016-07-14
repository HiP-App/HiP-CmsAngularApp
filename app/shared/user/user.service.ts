import { Injectable } from '@angular/core';
import {Response} from '@angular/http';

import { CmsApiService } from '../../shared/api/cms-api.service';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserService {

  constructor(private cmsApiService: CmsApiService) { }

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

  public getCurrent(): Promise<User> {
    return this.cmsApiService.getUrl('/api/Users/Current', {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public getAll(): Promise<User> {
    return this.cmsApiService.getUrl('/api/Users', {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
}
