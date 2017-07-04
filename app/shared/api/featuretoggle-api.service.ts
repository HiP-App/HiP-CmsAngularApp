import { Injectable } from '@angular/core';
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
              private config: ConfigService) {}

  private setUrl() {
    if (this.featureToggleUrl === undefined) {
      this.featureToggleUrl = this.config.get('featureToggleUrl');
    }
  }

  /**
   * Adds the featureToggleUrl to the api Call and does a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.get(this.featureToggleUrl + apiUrl, headers);
  }

  /**
   * Adds the featureToggleUrl to the api Call and does a HTTP GET request
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
   * Adds the featureToggleUrl to the api Call and does a HTTP GET request
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
   * Adds the featureToggleUrl to the api Call and does a HTTP DELETE request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.delete(this.featureToggleUrl + apiUrl, headers);
  }
}
