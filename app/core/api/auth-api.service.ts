import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ConfigService } from '../../config.service';
/**
 * This Service represents a Interface between HiPAuth and our App
 * Use this Service to login or register to the system.
 */
@Injectable()
export class AuthApiService {
  authUrl: string;

  constructor(private http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if(this.authUrl == undefined) {
      this.authUrl = this.config.get('authUrl');
    }
  }

  /**
   * Adds the authUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
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
    this.setUrl();
    return this.http.post(this.authUrl + apiUrl, data, headers);
  }
  /**
   * Adds the cmsUrl to the api Call and do a HTTP PUT request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.put(this.authUrl + apiUrl, data, headers);
  }
}
