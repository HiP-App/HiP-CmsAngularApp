import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../../config.service';

/**
 * This Service represents a Interface between HiP-UserstoreWebApi and our App
 * Use this Service to interact with the system.
 */
@Injectable()
export class UserStoreApiService {
  userStoreUrl: string;

  constructor(private http: AuthHttp,
              private _http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if (this.userStoreUrl === undefined) {
      this.userStoreUrl = this.config.get('userstore');
    }
  }

  /**
   * Adds the userStoreUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.get(this.userStoreUrl + apiUrl, headers);
  }

  /**
   * Adds the userStoreUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.post(this.userStoreUrl + apiUrl, data, headers);
  }

  /**
   * Adds the userStoreUrl to the api Call and does a HTTP POST request submitting FormData.
   * @param apiUrl relative path for the call
   * @param data the FormData which shall be send
   * @returns {Observable<Response>}
   */
  public putUrlWithFormData(apiUrl: string, data: any) {
    this.setUrl();
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    return this._http.put(this.userStoreUrl + apiUrl, data, {headers});
  }

  /**
   * Adds the userStoreUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.put(this.userStoreUrl + apiUrl, data, headers);
  }

  /**
   * Adds the userStoreUrl to the api Call and do a HTTP DELETE request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.delete(this.userStoreUrl + apiUrl, headers);
  }

  /**
   * Returns the API's root URL.
   * @returns {string}
   */
  public getRoot() {
    this.setUrl();
    return this.userStoreUrl;
  }
}
