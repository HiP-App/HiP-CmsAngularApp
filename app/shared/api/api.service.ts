import { Injectable } from '@angular/core';

import { CONFIG } from '../../config.constant';
import { Http } from '@angular/http';

@Injectable()
export class ApiService {
  authUrl = CONFIG['authUrl'];

  constructor(private http: Http) { }

  public getUrl(apiUrl: string) {
    let authUrl = CONFIG['authUrl'];
    alert(authUrl + apiUrl);
  }

  public postUrl(apiUrl: string, data: string, headers: any) {
    return this.http.post(this.authUrl + apiUrl, data, headers);
  }
}
