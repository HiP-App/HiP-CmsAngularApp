import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../../config.service';

@Injectable()
export class OOApiService {
  docsUrl: string;

  constructor(private http: AuthHttp,
              private _http: Http,
              private config: ConfigService) {}

  private setUrl() {
    if (this.docsUrl === undefined) {
      this.docsUrl = this.config.get('docsIntegrationUrl');
    }
  }

  /**
   * Adds the ooUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public getUrl(apiUrl: string, headers: any) {
    this.setUrl();
    return this.http.get(this.docsUrl + apiUrl, headers );
  }

  /**
   * Adds the docsUrl to the api Call and do a HTTP GET request
   * @param apiUrl relative path for the call
   * @param data the data which shall be send
   * @param headers additional headers
   * @returns {Observable<Response>}
   */
  public postUrl(apiUrl: string, data: any, headers: any) {
    this.setUrl();
    return this.http.post(this.docsUrl + apiUrl, data, headers);
  }

  /**
   * Adds the docsUrl to the api Call and does a HTTP POST request submitting FormData.
   * @param apiUrl relative path for the call
   * @param data the FormData which shall be send
   * @returns {Observable<Response>}
   */
  public postUrlWithFormData(apiUrl: string, data: any) {
    this.setUrl();
    let headers = new Headers();
    headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
    headers.append('Access-Control-Allow-Origin', '*');
    return this._http.post(this.docsUrl + apiUrl, data, { headers });
  }
}
