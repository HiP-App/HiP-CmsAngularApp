import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { CmsApiService } from '../../shared/api/cms-api.service';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';
/**
 * Service which does user related api calls and returns them as Promise <br />
 * Here is an example how to use it to get the current User. <br />
 * <code>
 * this.userService.getCurrent().then(<br />
 * data => this.currentUser = <User> data,<br />
 * ).catch(<br />
 * error => this.errorMessage = <any> error<br />
 * );
 * </code>
 */
@Injectable()
export class UserService {

  constructor(private cmsApiService: CmsApiService) { }

  private extractData(res: Response): User {
    let body = User.parseJSON(res.json());
    return body;
  }

  private extractArrayData(res: Response): User[] {
    let body = res.json();
    let users: User[] = [];
    for (let user of body.items) {
      users.push(User.parseJSON(user));
    }
    return users || [];
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  /**
   * Gets the current User.
   * @returns a Promise for a User object
   */
  public getCurrent(): Promise<User> {
    return this.cmsApiService.getUrl('/api/Users/Current', {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Gets a User by Id.
   * @param id The Id of the User you want to get
   * @returns a Promise for a User object
   */
  public getUser(id: number): Promise<User> {
    return this.cmsApiService.getUrl('/api/Users/' + id, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Gets the all Users.
   * @returns a Promise for an Array of User object
   */
  public getAll(): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users', {})
      .toPromise()
      .then(this.extractArrayData)
      .catch(this.handleError);
  }
}
