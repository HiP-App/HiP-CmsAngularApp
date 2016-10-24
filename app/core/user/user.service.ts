import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { CmsApiService } from '../api/cms-api.service';
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
  currentUserPromise: Promise<User>;

  constructor(private cmsApiService: CmsApiService, private http: Http) { }

  public clearSession() {
    this.currentUserPromise = undefined;
  }

  /**
   * Gets the current User.
   * @returns a Promise for a User object
   */
  public getCurrent(): Promise<User> {
    if (this.currentUserPromise === undefined) {
      this.currentUserPromise = this.cmsApiService.getUrl('/api/Users/Current', {})
        .toPromise()
        .then(User.extractData)
        .catch(this.handleError);
    }
    return this.currentUserPromise;
  }

  /**
   * Gets a User by Id.
   * @param id The Id of the User you want to get
   * @returns a Promise for a User object
   */
  public getUser(id: number): Promise<User> {
    return this.cmsApiService.getUrl('/api/Users/' + id, {})
      .toPromise()
      .then(User.extractData)
      .catch(this.handleError);
  }

 /**
 * Gets Users by Search Parameter.
 * @param emailId The emailId of the User you want to get
 * @returns a Promise for a Student object
 */
  public getUserNames(emailId: string, role: string): Promise<User[]> {
      return this.cmsApiService.getUrl('/api/Users/?query=' + emailId + '&role=' + role, {})
          .toPromise()
          .then(User.extractPaginationedArrayData)
          .catch(this.handleError);
  }

  /**
  * Gets a UserId.
  * @param emailId The emailId of the User you want to get
  * @returns a Promise for a Student object
  */
  public getUserbyEmail(emailId: string): Promise<User[]> {
      return this.cmsApiService.getUrl('/api/Users/?query=' + emailId, {})
          .toPromise()
          .then(User.extractPaginationedArrayData)
          .catch(this.handleError);
  }

  /**
   * Gets the all Users.
   * @returns a Promise for an Array of User object
   */
  public getAll(): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users', {})
      .toPromise()
      .then(User.extractArrayData)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg);
    return Observable.throw(errMsg);
  }

  public updateUser(user: User): Promise<User> {
    // let u = user.formData();
    let data = '';
    data += 'id=' + user.id + '&';
    data += 'Email=' + user.email + '&';
    data += 'FirstName=' + user.firstName + '&';
    data += 'LastName=' + user.lastName + '&';
    data += 'Role=' + user.role + '&';
    data += 'FullName=' + user.firstName + ' ' + user.lastName;
    return this.cmsApiService.putUrl('/api/Users/' + user.id, data, {})
      .toPromise()
      .then(User.extractData)
      .catch(this.handleError);
  }

  public uploadPicture(fileToUpload: any, userId = 'Current') {
    let headers = new Headers();
    let data = new FormData();
    data.append('file', fileToUpload);

    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');

    const url = 'http://docker-hip.cs.upb.de:5000/api/Users/' + userId + '/picture';

    return this.http.post(url, data, {headers})
       .toPromise()
       .then((response: any) => console.log(response))
       .catch(this.handleError);
  }

  public deletePicture(userId = 'Current') {
    // let u = user.formData();
    let headers = new Headers();

    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'multipart/form-data');

    const url = '/api/Users/' + userId + '/picture';

    return this.cmsApiService.deleteUrl(url, {headers} )
       .toPromise()
       .then((response: any) => console.log(response))
       .catch(this.handleError);
  }
}
