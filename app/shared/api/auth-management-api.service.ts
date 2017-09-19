import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../../config.service';
import { Roles } from '../../users/admin/roles.model';

/**
 * This service represents a interface between the HiP-AuthManager and our app.
 */
@Injectable()
export class AuthManagementApiService {
  url: string;

  constructor(private http: AuthHttp, private config: ConfigService) {
    this.url = this.config.get('authManagementAudience');
  }

  /**
   * Gets the users form the auth0 database
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUsers(headers: any = {}) {
    return this.http.get(this.url + '/Users', headers);
  }

  /**
   * Changes the role of the given user.
   * @param userId the Auth0 ID of the user
   * @param role the new role of the user
   * @param headers? any additional headers to send
   * @returns {Observable<Response>}
   */
  public putRoles(userId: string, role: string, headers: any = {}) {
    if (!Roles.ROLES.includes(role)) {
      return new TypeError('Role must be one of Administrator, Supervisor or Student');
    }
    const data = {
      roles: [ role ]
    };
    return this.http.put(`${this.url}/Users/${userId}/ChangeRole`, data, headers);
  }
}
