import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { CmsApiService } from '../core/api/cms-api.service';
import { FeatureGroup, Feature } from './feature-toggle.model';

/**
 * Service which does feature toggle related api calls
 */
@Injectable()
export class FeatureToggleService {

  constructor(private cmsApiService: CmsApiService) {}

  /**
   * Get all featuregroups.
   * @return all feature-groups
   */
  public getAllFeatureGroups() {
    return this.cmsApiService.getUrl('/api/featureGroups', {})
      .toPromise()
      .then(
        (response: any) => FeatureGroup.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching all feature groups', error)
      );
  }

  /**
   * Get featuregroup by id.
   * @return feature-group
   */
  public getFeatureGroup(id: number) {
    return this.cmsApiService.getUrl('/api/featureGroups/'+ id, {})
      .toPromise()
      .then(
        (response: any) => response.json()
      ).catch(
        (error: any) => this.handleError('Error during fetching feature group', error)
      );
  }

  /**
   * Get all features.
   * @return all features
   */
  public getAllFeatures() {
    return this.cmsApiService.getUrl('/api/features', {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError('Error during fetching all feature groups', error)
      );
  }

  /**
   * Get feature by id.
   * @return feature
   */
  public getFeature(id: number) {
    return this.cmsApiService.getUrl('/api/feature/'+ id, {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching feature group', error)
      );
  }

  // POST

  /**
   * Creates a FeatureGroup on the backend
   * @param featureGroup The FeatureGroup you want to save
   */
  public createFeatureGroup(featureGroup : FeatureGroup) {
    debugger;
    return this.cmsApiService.postUrl('/api/featureGroups', JSON.stringify(featureGroup), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError('Error during saving new feature groups', error)
      );
  }

  /**
   * updates the feature group
   */
  public putFeatureGroup(featureGroup : FeatureGroup) {
    return this.cmsApiService.putUrl('/api/featureGroups/' + featureGroup.id + '/', JSON.stringify({ featureGroup }), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature group',error)
      );
  }

  /**
   * updates the user in feature group
   */
  public putUserInFeatureGroup(id: number, featureId: number, data: string[]) {
    return this.cmsApiService.putUrl('/api/users' + id + '/FeatureGroup' + featureId , JSON.stringify({ data }), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature group',error)
      );
  }

  /**
   * updates the feature
   */
  public putFeature(feature : Feature) {
    return this.cmsApiService.putUrl('/api/feature/' + feature.id + '/', JSON.stringify({ feature }), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature',error)
      );
  }

  /**
   * Delete feature by id.
   */
  public deleteFeatureGroup(id: number) {
    return this.cmsApiService.deleteDemoUrl('/api/featureGroups/'+ id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError('Error during deleting feature group', error)
      );
  }

  /**
   * Delete feature by id.
   */
  public deleteFeature(id: number) {
    return this.cmsApiService.deleteDemoUrl('/api/features/'+ id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError('Error during deleting feature', error)
      );
  }

  private handleError(method: string, error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

}
