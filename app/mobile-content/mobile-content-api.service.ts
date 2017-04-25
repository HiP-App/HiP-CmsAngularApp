import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../config.service';

/**
 * Service for sending request to the mobile content API.
 */
@Injectable()
export class MobileContentApiService {
  mobileContentApiUrl: string;

  constructor(private http: AuthHttp,
              private config: ConfigService) {}

  private setUrl() {
    if (this.mobileContentApiUrl === undefined) {
      this.mobileContentApiUrl = this.config.get('mobileContentApiUrl');
    }
  }

  /**
   * Adds the URL of the mobile content API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.get(this.mobileContentApiUrl + apiUrl, headers);
  }

  /**
   * Adds the URL of the mobile content API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.post(this.mobileContentApiUrl + apiUrl, data, headers);
  }

  /**
   * Adds the URL of the mobile content API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.put(this.mobileContentApiUrl + apiUrl, data, headers);
  }

  /**
   * Adds the URL of the mobile content API to the API Call and does a HTTP DELETE request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.delete(this.mobileContentApiUrl + apiUrl, headers);
  }
}
