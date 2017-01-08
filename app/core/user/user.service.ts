import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { CmsApiService } from '../api/cms-api.service';
import { User } from './user.model';

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
  private currentUserPromise: Promise<User>;
  private currentUserCanAdmin: Promise<boolean>;
  private currentUserCanCreate: Promise<boolean>;

  constructor(private cmsApiService: CmsApiService) {}

  /**
   * Resets current user.
   */
  public clearSession(): void {
    this.currentUserPromise = undefined;
    this.currentUserCanAdmin = undefined;
    this.currentUserCanCreate = undefined;
  }

  /**
   * Checks if current user has administrator privileges.
   * @returns {Promise<boolean>} true if current user can administer, false otherwise
   */
  public currentUserCanAdminister(): Promise<boolean> {
    if (this.currentUserCanAdmin === undefined) {
      this.currentUserCanAdmin = this.cmsApiService.getUrl('/Api/Permissions/Users/All/Permission/IsAllowedToAdminister', {})
        .toPromise()
        .then(
          (response: any) => response.status === 200
        ).catch(
          (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
        );
    }
    return this.currentUserCanAdmin;
  }

  /**
   * Checks if current user is allowed to create new topics.
   * @returns {Promise<boolean>} true if current user can create topics, false otherwise
   */
  public currentUserCanCreateTopics(): Promise<boolean> {
    if (this.currentUserCanCreate === undefined) {
      this.currentUserCanCreate = this.cmsApiService.getUrl('/Api/Permissions/Topics/All/Permission/IsAllowedToCreate', {})
        .toPromise()
        .then(
          (response: any) => response.status === 200
        ).catch(
          (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
        );
    }
    return this.currentUserCanCreate;
  }

  /**
   * Gets the all Users.
   * @returns a Promise for an Array of User objects
   */
  public getAll(): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users', {})
      .toPromise()
      .then(
        (response: any) => User.extractArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets the current User.
   * @returns a Promise for a User object
   */
  public getCurrent(): Promise<User> {
    if (this.currentUserPromise === undefined) {
      this.currentUserPromise = this.cmsApiService.getUrl('/api/Users/Current', {})
        .toPromise()
        .then(
          (response: any) => User.extractData(response)
        ).catch(
          (error: any) => this.handleError(error)
        );
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
      .then(
        (response: any) => User.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets a user by email address.
   * @param emailId The emailId of the User you want to get
   * @returns a Promise for a user object
   */
  public getUserByEmail(emailId: string): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users/?query=' + emailId, {})
      .toPromise()
      .then(
        (response: any) => User.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets Users by Search Parameter.
   * @param emailId The emailId of the User you want to get
   * @param role the role of the user
   * @returns a Promise for a Student object
   */
  public getUserNames(emailId: string, role: string): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users/?query=' + emailId + '&role=' + role, {})
      .toPromise()
      .then(
        (response: any) => User.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public updateUser(user: User): Promise<any> {
    let data = '';
    data += 'id=' + user.id + '&';
    data += 'Email=' + user.email + '&';
    data += 'FirstName=' + user.firstName + '&';
    data += 'LastName=' + user.lastName + '&';
    data += 'Role=' + user.role + '&';
    data += 'FullName=' + user.firstName + ' ' + user.lastName;
    return this.cmsApiService.putUrl('/api/Users/' + user.id, data, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  public getPicture(userId: String): Promise<any> {
    return this.cmsApiService.getUrl('/api/Users/' + userId + '/picture', {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public uploadPicture(fileToUpload: any, userId: String) {
    let data = new FormData();
    data.append('file', fileToUpload);
    return this.cmsApiService.postUrlWithFormData('/api/Users/' + userId + '/picture', data)
       .toPromise()
       .catch(
         (error: any) => this.handleError(error)
       );
  }

  public deletePicture(userId: String) {
    return this.cmsApiService.deleteUrl('/api/Users/' + userId + '/picture', {} )
       .toPromise()
       .then(
         (response: any) => console.log(response)
       ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates User Information
   * @param firstName The first name of the user
   * @param lastName The last name of the user
   */
  public updateUserInfo(firstName: string, lastName: string) {
    let data = 'FirstName=' + firstName + '&LastName=' + lastName;
    return this.cmsApiService.putUrl('/Api/Users/Current', data, {})
      .toPromise()
      .then(
        (response: any) => {
          if (response.status === 200) {
            return 'Information successfully updated';
          }
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public inviteUsers(emails: any) {
    let body = '';    
    for (let email of emails) {
      body += 'emails=' + email + '&';
    }
    return this.cmsApiService.postUrl('/Api/Users/Invite', body, {})
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(Observable.throw(errMsg));
  }
}
