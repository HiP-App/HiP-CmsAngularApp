import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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
        (response: any) => User.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  public getAllStudents(): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users?role=Student', {})
      .toPromise()
      .then(
        (response: any) => User.extractPaginationedArrayData(response)
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
      this.currentUserPromise = this.cmsApiService.getUrl('/api/User', {})
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
  public getUser(identifier: string): Promise<User> {
    return this.cmsApiService.getUrl('/api/User?identy=' + identifier, {})
      .toPromise()
      .then(
        (response: any) => User.extractData(response)
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
  public getUsers(emailId: string, role: string): Promise<User[]> {
    return this.cmsApiService.getUrl('/api/Users/?query=' + emailId + '&role=' + role, {})
      .toPromise()
      .then(
        (response: any) => User.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates User Information
   * @param user object with updated data
   * @param isCurrent updating the current user? Default value is false.
   */
  public updateUser(user: User, isCurrent = false): Promise<any> {
    return this.cmsApiService.putUrl('/api/User' + ( isCurrent ? '' : '?identy=' + user.email ), JSON.stringify(user), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  public getPicture(identifier: string, useCurrent = false): Promise<any> {
    return this.cmsApiService.getUrl('/api/User/Picture' + (useCurrent ? '' : '?userIdenty=' + identifier), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  public uploadPicture(fileToUpload: any, identifier: string) {
    let data = new FormData();
    data.append('file', fileToUpload);
    return this.cmsApiService.putUrlWithFormData('/api/User/Picture?identy=' + identifier, data)
       .toPromise()
       .catch(
         (error: any) => this.handleError(error)
       );
  }

  public deletePicture(identifier: string) {
    return this.cmsApiService.deleteUrl('/api/User/Picture?identy=' + identifier, {} )
       .toPromise()
       .then(
         (response: any) => (response.status === 200)
       ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates the student details for the given user.
   * @param user the user
   * @param isCurrent updating the current user? Default value is false.
   * @returns {Promise<string>}
   */
  public updateStudentDetails(user: User, isCurrent = false) {
    return this.cmsApiService.putUrl('/Api/User/Student' + (!isCurrent ? '?identy=' + user.email : ''), JSON.stringify(user.studentDetails), {})
      .toPromise()
      .then(
        (response: Response) => {
          if (response.status === 200) {
            return 'Information successfully updated';
          }
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates the student details of the current user with the given user data.
   * @param user the user
   * @returns {Promise<string>}
   */
  public updateCurrentStudentDetails(user: User) {
    return this.updateStudentDetails(user, true);
  }

  /**
   * Sends invitations to the given email addresses.
   * @param emails
   * @returns {Promise<TResult>}
   */
  public inviteUsers(emails: string[]) {
    return this.cmsApiService.postUrl('/Api/Users/Invite', JSON.stringify({emails: emails}), {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    console.log(error);
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(Observable.throw(errMsg));
  }
}
