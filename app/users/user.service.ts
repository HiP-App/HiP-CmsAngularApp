import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CmsApiService } from '../shared/api/cms-api.service';
import { User } from './user.model';
import { UserStoreApiService } from '../shared/api/userstore-api.service';
import { BehaviorSubject } from 'rxjs/Rx';

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
  private userCache: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(private cmsApiService: CmsApiService,
    private userStoreApiService: UserStoreApiService) { }

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
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError<boolean>(response)
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
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError<boolean>(response)
        );
    }
    return this.currentUserCanCreate;
  }

  /**
   * Gets the all Users. - USERSTORE API
   * @returns a Promise for an Array of User objects
   */
  public getAll(): Promise<User[]> {
    return this.queryAll()
      .then(data => data.items)
      .catch(error => this.handleError(error));
  }

  /**
   * Retrieves a subset of all users based on supplied pagination and filter parameters.
   * If all parameters are omitted, will return all users.
   *
   * Returns an object with two keys:
   * `items` which contains the array of requested users, and
   * `metadata` which contains info about the returned subset (page number, total items, etc.)
   * @param page Page number. If omitted, is non-integer or less than zero, will return all users.
   * @param pageSize Number of users per page. Defaults to 10. Has no effect when `page` is not set.
   * @param role If specified, will only return users of that role.
   * @param query An additional string to search for in the result set. If specified, only matches will be returned.
   */
  public queryAll(page?: number, pageSize = 10, role?: string, query?: string): Promise<{ items: User[], total: number }> {
    let requestParams = new URLSearchParams();
    if (role) {
      requestParams.append('role', role);
    }
    if (query) {
      requestParams.append('query', query);
    }
    if (Number.isInteger(page) && page > 0) {
      requestParams.append('page', page.toString());
      requestParams.append('pageSize', pageSize.toString());
    }

    return this.userStoreApiService.getUrl('/api/Users?' + requestParams.toString(), {})
      .toPromise()
      .then(
      response => {
        return {
          items: User.extractPaginatedArrayData(response),
          total: response.json().total
        };
      }
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
   * Returns the list of all disciplines a student can study. - USERSTORE API
   */
  public getDisciplines(): Promise<string[]> {
    return this.userStoreApiService.getUrl('/api/Students/Disciplines', {})
      .toPromise()
      .then(
      response => response.json()
      ).catch(
      error => this.handleError(error)
      );
  }

  /**
   * Gets a User by Id. - USERSTORE API
   * @param identifier The Id of the User you want to get
   * @returns a Promise for a User object
   */
  public getUser(id: string): Promise<User> {
    return this.userStoreApiService.getUrl('/api/Users/' + id, {})
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
      (response: any) => User.extractPaginatedArrayData(response)
      ).catch(
      (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates User Information. - USERSTORE
   * @param user object with updated data
   * @param isCurrent updating the current user? Default value is false.
   */
  public updateUser(user: User, isCurrent = false): Promise<any> {
    return this.userStoreApiService.putUrl('/api/Users/' + user.id, JSON.stringify(user), {})
      .toPromise()
      .then(
      (response: Response) => {
        let localUser = this.userCache.getValue();
        let userToUpdate = localUser.find(item => item.id === user.id);
        for (let prop in userToUpdate) {
          if (userToUpdate.hasOwnProperty(prop)) {
            userToUpdate[prop] = user[prop];
          }
        }

        this.userCache.next(localUser);

        return response;
      }
      )
      .catch(
      (error: any) => this.handleError(error)
      );
  }

  public getPicture(id: string, useCurrent = false): Promise<any> {
    return this.userStoreApiService.getUrl('/api/Users/' + (useCurrent ? '' : '?id=' + id) + '/Photo', {})
      .toPromise()
      .catch(
      (error: any) => this.handleError(error)
      );
  }

  public uploadPicture(fileToUpload: any, id: string) {
    let formData: FormData = new FormData();
    formData.append('file', fileToUpload);
    return this.userStoreApiService.putUrlWithFormData('/api/Users/' + id + '/Photo', formData)
      .toPromise()
      .catch(
      (error: any) => this.handleError(error)
      );
  }

  public deletePicture(id: string) {
    return this.userStoreApiService.deleteUrl('/api/Users/' + id + '/Photo', {})
      .toPromise()
      .then(
      (response: any) => (response.status === 200)
      ).catch(
      (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates the student details for the given user. - USERSTORE
   * @param user the user
   * @param isCurrent updating the current user? Default value is false.
   * @returns {Promise<string>}
   */
  public updateStudentDetails(user: User, isCurrent = false) {
    return this.userStoreApiService.putUrl('/api/Users/' + user.id + '/StudentDetails', JSON.stringify(user.studentDetails), {})
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
    return this.cmsApiService.postUrl('/Api/Users/Invite', JSON.stringify({ emails: emails }), {})
      .toPromise()
      .then(
      (response: any) => response
      ).catch(
      (error: any) => this.handleError(error)
      );
  }

  private handleError<T>(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject<T>(Observable.throw(errMsg));
  }
}