import { Injectable } from '@angular/core';
import { CmsApiService } from '../../core/api/cms-api.service';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


import { IFeature } from './feature';


@Injectable()
export class FeatureService {

  private featuresUrl = './features.json';


  constructor(private cmsApiService: CmsApiService,
              private _http: Http) {}


                getFeatures(): Observable<IFeature[]> {
                      return this._http.get(this.featuresUrl)
                          .map((response: Response) => <IFeature[]> response.json())
                          .catch(this.handleError);
                  }

                  getFeature(id: number): Observable<IFeature> {
                      return this.getFeatures()
                          .map((products: IFeature[]) => products.find(p => p.id === id));
                  }

                  deleteFeature(id: number): Observable<IFeature> {
                    return this._http.get(this.featuresUrl)
                        .map((response: Response) => <IFeature[]> response.json())
                        .catch(this.handleError);
                  }

                  private handleError(error: Response) {
                   console.error(error);
                   return Observable.throw(error.json().error || 'Server error');
   }

}
