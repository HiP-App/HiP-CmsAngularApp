import { Injectable } from '@angular/core';

import { FeatureToggleApiService } from '../shared/api/featuretoggle-api.service';
import { FeatureGroup, Feature } from './feature-toggle.model';

/**
 * Service which does feature toggle related api calls
 */
@Injectable()
export class FeatureToggleService {

  constructor(private featureToggleApiService: FeatureToggleApiService) {
  }

  /**
   * Get all featuregroups.
   * @return all feature-groups
   */
  public getAllFeatureGroups() {
    return this.featureToggleApiService.getUrl('/api/featureGroups', {})
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
    return this.featureToggleApiService.getUrl('/api/featureGroups/' + id, {})
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
    return this.featureToggleApiService.getUrl('/api/features', {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching all feature groups', error)
      );
  }

  /**
   * Get feature by id.
   * @return feature
   */
  public getFeature(id: number) {
    return this.featureToggleApiService.getUrl('/api/features/' + id, {})
      .toPromise()
      .then(
        (response: any) => response.json()
      ).catch(
        (error: any) => this.handleError('Error during fetching feature group', error)
      );
  }

  /**
   * Get feature toggles.
   * @return feature toggles
   */
  public isEnabledForUsers(id: number) {
    return this.featureToggleApiService.getUrl('/api/features/IsEnabled', {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching feature group', error)
      );
  }

  /**
   * Get feature toggles by id.
   * @return feature toggles
   */
  public isFeatureEnabledForCurrentUser(featureId: number): Promise<boolean> {
    return this.featureToggleApiService.getUrl('/Features/{featureId}/IsEnabled', {})
      .toPromise()
      .then(
        (response: any) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : console.error(response)
      );
  }

  // POST

  /**
   * Creates a FeatureGroup on the backend
   * @param featureGroup The FeatureGroup you want to save
   */
  public createFeatureGroup(featureGroup: FeatureGroup) {
    return this.featureToggleApiService.postUrl('/api/featureGroups', JSON.stringify(featureGroup), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError('Error during saving new feature group', error)
      );
  }

  /**
   * Creates a Feature on the backend
   * @param feature The Feature you want to save
   */
  public createFeature(feature: Feature) {
    return this.featureToggleApiService.postUrl('/api/features', JSON.stringify(feature), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError('Error during saving new feature', error)
      );
  }

  /**
   * updates the feature group
   */
  public putFeatureGroup(featureGroup: FeatureGroup) {
    return this.featureToggleApiService.putUrl('/api/featureGroups/' + featureGroup.id + '/', JSON.stringify({featureGroup}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature group', error)
      );
  }

  /**
   * updates the user in feature group
   */
  public putUserInFeatureGroup(id: number, featureId: number, data: string[]) {
    return this.featureToggleApiService.putUrl('/api/users' + id + '/FeatureGroup' + featureId, JSON.stringify({data}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature group', error)
      );
  }

  /**
   * updates the feature
   */
  public putFeature(feature: Feature) {
    let featureJson = JSON.stringify({name: feature.name , parent: feature.parent});
    return this.featureToggleApiService.putUrl('/api/features/' + feature.id + '/', featureJson, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError('Error during updating feature', error)
      );
  }

  /**
   * Delete feature group by id.
   */
  public deleteFeatureGroup(id: number) {
    return this.featureToggleApiService.deleteUrl('/api/featureGroups/' + id, {})
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
    return this.featureToggleApiService.deleteUrl('/api/features/' + id, {})
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
