import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../../config.service';

/**
 * This Service represents a Interface between HiP-CmsWebApi and our App
 * Use this Service to interact with the system.
 */
@Injectable()
export class FeatureToggleApiService {
  featureToggleUrl: string;

  constructor(private http: AuthHttp,
              private _http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if (this.featureToggleUrl === undefined) {
      this.featureToggleUrl = this.config.get('featureToggleUrl');
    }
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.get(this.featureToggleUrl + apiUrl, headers);
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.post(this.featureToggleUrl + apiUrl, data, headers);
  }

  /**
   * Adds the cmsURl to the api Call and does a HTTP POST request submitting FormData.
   * @param apiUrl relative path for the call
   * @param data the FormData which shall be send
   * @returns {Observable<Response>}
   */
  public putUrlWithFormData(apiUrl: string, data: any) {
    this.setUrl();
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    return this._http.put(this.featureToggleUrl + apiUrl, data, {headers});
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: string, headers: any) {
    this.setUrl();
    return this.http.put(this.featureToggleUrl + apiUrl, data, headers);
  }

  /**
   * Adds the cmsUrl to the api Call and do a HTTP DELETE request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.delete(this.featureToggleUrl + apiUrl, headers);
  }

  /**
   * Returns the API's root URL.
   * @returns {string}
   */
  public getRoot() {
    this.setUrl();
    return this.featureToggleUrl;
  }
}
