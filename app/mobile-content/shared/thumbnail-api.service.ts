import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';

import { ConfigService } from '../../config.service';

/**
 * Service for sending request to the thumbnail API.
 */
@Injectable()
export class ThumbnailApiService {
  private thumbnailApiUrl: string;

  constructor(private authHttp: AuthHttp,
              private http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if (this.thumbnailApiUrl === undefined) {
      this.thumbnailApiUrl = this.config.get('thumbnailApiUrl');
    }
  }

  /**
   * Adds the URL of the thumbnail API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: object = {}) {
    this.setUrl();
    return this.authHttp.get(this.thumbnailApiUrl + apiUrl, headers);
  }

  /**
   * Adds the URL of the thumbnail API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: any, headers: object = {}) {
    this.setUrl();
    return this.authHttp.post(this.thumbnailApiUrl + apiUrl, data, headers);
  }

  /**
   * Adds the URL of the thumbnail API to the API Call and does a HTTP GET request.
   *
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public putUrl(apiUrl: string, data: any, headers: object = {}) {
    this.setUrl();
    return this.authHttp.put(this.thumbnailApiUrl + apiUrl, data, headers);
  }


  public putUrlWithFormData(apiUrl: string, data: any) {
    this.setUrl();
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    return this.http.put(this.thumbnailApiUrl + apiUrl, data, {headers});
  }

  /**
   * Adds the URL of the thumbnail API to the API Call and does a HTTP DELETE request.
   *
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public deleteUrl(apiUrl: string, headers: object = {}) {
    this.setUrl();
    return this.authHttp.delete(this.thumbnailApiUrl + apiUrl, headers);
  }
}