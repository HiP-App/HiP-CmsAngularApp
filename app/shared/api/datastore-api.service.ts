import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { ConfigService } from '../../config.service';

/**
 * This Service represents a Interface between HiP-DataStoreWebApi and our App
 * Use this Service to interact with the system.
 */
@Injectable()
export class DataStoreApiService {
    dataStoreUrl: string;

    constructor(private http: AuthHttp,
                private _http: Http,
                private config: ConfigService) {}

    private setUrl() {
        if (this.dataStoreUrl === undefined) {
            this.dataStoreUrl = this.config.get('dataStoreUrl');
        }
    }

    /**
     * Adds the dataStoreUrl to the api Call and do a HTTP GET request
     * @param apiUrl relative path for the call
     * @param headers additional headers
     * @returns {Observable<Response>}
     */
    public getUrl(apiUrl: string, headers: any) {
        this.setUrl();
        return this.http.get(this.dataStoreUrl + apiUrl, headers);
    }

    /**
     * Adds the dataStoreUrl to the api Call and do a HTTP GET request
     * @param apiUrl relative path for the call
     * @param data the data which shall be send
     * @param headers additional headers
     * @returns {Observable<Response>}
     */
    public postUrl(apiUrl: string, data: string, headers1: any) {
        this.setUrl();
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.dataStoreUrl + apiUrl, data, headers);
    }

    /**
     * Adds the dataStoreURl to the api Call and does a HTTP POST request submitting FormData.
     * @param apiUrl relative path for the call
     * @param data the FormData which shall be send
     * @returns {Observable<Response>}
     */
    public putUrlWithFormData(apiUrl: string, data: any) {
        this.setUrl();
        let headers = new Headers();
        headers.append('authorization', 'Bearer ' + localStorage.getItem('id_token'));
        headers.append('Access-Control-Allow-Origin', '*');
        return this._http.put(this.dataStoreUrl + apiUrl, data, {headers});
    }

    /**
     * Adds the dataStoreUrl to the api Call and do a HTTP GET request
     * @param apiUrl relative path for the call
     * @param data the data which shall be send
     * @param headers additional headers
     * @returns {Observable<Response>}
     */
    public putUrl(apiUrl: string, data: string, headers: any) {
        this.setUrl();
        return this.http.put(this.dataStoreUrl + apiUrl, data, headers);
    }

    /**
     * Adds the dataStoreUrl to the api Call and do a HTTP DELETE request
     * @param apiUrl relative path for the call
     * @param headers additional headers
     * @returns {Observable<Response>}
     */
    public deleteUrl(apiUrl: string, headers: any) {
        this.setUrl();
        return this.http.delete(this.dataStoreUrl + apiUrl, headers);
    }

    /**
     * Returns the API's root URL.
     * @returns {string}
     */
    public getRoot() {
        this.setUrl();
        return this.dataStoreUrl;
    }
}
