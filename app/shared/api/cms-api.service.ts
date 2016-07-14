import { Injectable } from '@angular/core';

import { CONFIG } from '../../config.constant';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class CmsApiService {
  cmsUrl = CONFIG['cmsUrl'];

  constructor(private http: AuthHttp) { }

  public getUrl(apiUrl: string, headers: any) {
    return this.http.get(this.cmsUrl + apiUrl, headers);
  }

  public postUrl(apiUrl: string, data: string, headers: any) {
    return this.http.post(this.cmsUrl + apiUrl, data, headers);
  }

  public putUrl(apiUrl: string, data: string, headers: any) {
    return this.http.put(this.cmsUrl + apiUrl, data, headers);
  }

  public deleteUrl(apiUrl: string, headers: any) {
    return this.http.delete(this.cmsUrl + apiUrl, headers);
  }
}
