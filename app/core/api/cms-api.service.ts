import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { CONFIG } from '../../config.constant';
import { AuthHttp } from 'angular2-jwt';

/**
 * This Service represents a Interface between HiP-CmsWebApi and our App
 * Use this Service to interact with the system.
 */
@Injectable()
export class CmsApiService {
  cmsUrl = CONFIG['cmsUrl'];
  docsUrl = CONFIG['docsUrl'];
  public docsGetUrl(apiUrl: string, headers: any) {
    return this.http.get(this.docsUrl + apiUrl, headers);
  }

  constructor(private http: AuthHttp,
              private _http: Http) { }

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
  public postUrl(apiUrl: string, data: string, headers: any) {
    return this.http.post(this.cmsUrl + apiUrl, data, headers);
  }

  /**
   * Adds the cmsURl to the api Call and does a HTTP POST request submitting FormData.
   * @param apiUrl relative path for the call
   * @param data the FormData which shall be send
   * @returns {Observable<Response>}
   */
  public postUrlWithFormData(apiUrl: string, data: any) {
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    return this._http.post(this.cmsUrl + apiUrl, data, {headers});
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

  /**
   * Returns the API's root URL.
   * @returns {string}
   */
  public getRoot() {
    return this.cmsUrl;
  }
}
