import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';

import { ConfigService } from '../../config.service';

/**
 * Service for sending request to the achievement API.
 */
@Injectable()
export class AchievementApiService {
  private achievementApiUrl: string;

  constructor(private authHttp: AuthHttp,
              private http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if (this.achievementApiUrl === undefined) {
      this.achievementApiUrl = this.config.get('achievementApiUrl');
    }
  }

  /**
   * Adds the URL of the achievement API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: object = {}) {
    this.setUrl();
    return this.authHttp.get(this.achievementApiUrl + apiUrl, headers);
  }

  /**
   * Adds the URL of the achievement API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: any, headers: object = {}) {
    this.setUrl();
    return this.authHttp.post(this.achievementApiUrl + apiUrl, data, headers);
  }

  /**
   * Adds the URL of the achievement API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: any, headers: object = {}) {
    this.setUrl();
    return this.authHttp.put(this.achievementApiUrl + apiUrl, data, headers);
  }


  public putUrlWithFormData(apiUrl: string, data: any) {
    this.setUrl();
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    return this.http.put(this.achievementApiUrl + apiUrl, data, {headers});
  }

  /**
   * Adds the URL of the achievement API to the API Call and does a HTTP DELETE request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: object = {}) {
    this.setUrl();
    return this.authHttp.delete(this.achievementApiUrl + apiUrl, headers);
  }
}
