import { Injectable } from '@angular/core';

import { CONFIG } from '../../config.constant';
import { Http } from '@angular/http';
/**
 * This Service represents a Interface between HiPAuth and our App
 * Use this Service to login or register to the system.
 */
@Injectable()
export class AuthApiService {
  authUrl = CONFIG['authUrl'];

  constructor(private http: Http) { }

  /**
   * Adds the authUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    return this.http.get(this.authUrl + apiUrl, headers);
  }

  /**
   * Adds the authUrl to the api Call and do a HTTP POST request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: string, headers: any) {
    return this.http.post(this.authUrl + apiUrl, data, headers);
  }
}
