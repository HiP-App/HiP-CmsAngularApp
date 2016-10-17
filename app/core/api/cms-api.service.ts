import { Injectable } from '@angular/core';

import { CONFIG } from '../../config.constant';
import { AuthHttp } from 'angular2-jwt';

/**
 * This Service represents a Interface between HiP-CmsWebApi and our App
 * Use this Service to interact with the system.
 */
@Injectable()
export class CmsApiService {
  cmsUrl = CONFIG['cmsUrl'];

  constructor(private http: AuthHttp) { }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    return this.http.get(this.cmsUrl + apiUrl, headers);
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: any, headers: any) {
    return this.http.post(this.cmsUrl + apiUrl, data, headers);
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: string, headers: any) {
    return this.http.put(this.cmsUrl + apiUrl, data, headers);
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP DELETE request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: any) {
    return this.http.delete(this.cmsUrl + apiUrl, headers);
  }
}
