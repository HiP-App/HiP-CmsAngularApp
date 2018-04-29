import { Injectable } from '@angular/core';
import { Response, RequestOptions, ResponseContentType, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import { CmsApiService } from '../shared/api/cms-api.service';
import { UserStoreApiService } from '../shared/api/userstore-api.service';

import { User } from './user.model';
import { errCode } from '../authentication/auth.service';

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
   * Gets the all Users. -- NEW USERSTORE API
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
  public queryAll(page?: number, pageSize = 10, roles?: string, query?: string): Promise<{ items: User[], total: any }> {
    let requestParams = new URLSearchParams();
    if (roles) {
      requestParams.append('role', roles);
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

  public createUser(email: string, firstname: string, lastname: string, password: string): Promise<User> {
      return this.userStoreApiService.postUrl('/api/Users', JSON.stringify({email, firstname, lastname, password}), {})
      .toPromise()
      .then(
      (response: any) => response
      ).catch(
      (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets a User by Id. -- NEW USERSTORE API
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

  private handleError<T>(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject<T>(Observable.throw(errMsg));
  }
}
