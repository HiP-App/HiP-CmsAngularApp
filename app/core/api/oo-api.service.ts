import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';

import { ConfigService } from '../../config.service';

@Injectable()
export class OOApiService {

  docsUrl: string;

  constructor(private http: AuthHttp, private config: ConfigService) { }

  private setUrl() {
    if(this.docsUrl == undefined) {
      this.docsUrl = this.config.get('docsUrl');
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
}