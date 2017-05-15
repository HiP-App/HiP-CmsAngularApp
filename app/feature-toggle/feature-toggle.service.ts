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
    return this.featureToggleApiService.getUrl('/Api/FeatureGroups', {})
      .toPromise()
      .then(
        (response: any) => FeatureGroup.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get featuregroup by id.
   * @return feature-group
   */
  public getFeatureGroup(id: number) {
    return this.featureToggleApiService.getUrl('/Api/FeatureGroups/' + id, {})
      .toPromise()
      .then(
        (response: any) => response.json()
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get all features.
   * @return all features
   */
  public getAllFeatures() {
    return this.featureToggleApiService.getUrl('/Api/Features', {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get feature by id.
   * @return feature
   */
  public getFeature(id: number) {
    return this.featureToggleApiService.getUrl('/Api/Features/' + id, {})
      .toPromise()
      .then(
        (response: any) => response.json()
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get feature toggles.
   * @return feature toggles
   */
  public isEnabledForUsers(id: number) {
    return this.featureToggleApiService.getUrl('/Api/Features/IsEnabled', {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get feature toggles by id.
   * @return feature toggles
   */
  public isFeatureEnabledForCurrentUser(featureId: number): Promise<boolean> {
    return this.featureToggleApiService.getUrl('/Api/Features/{featureId}/IsEnabled', {})
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
    return this.featureToggleApiService.postUrl('/Api/FeatureGroups', JSON.stringify(featureGroup), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Creates a Feature on the backend
   * @param feature The Feature you want to save
   */
  public createFeature(feature: Feature) {
    return this.featureToggleApiService.postUrl('/api/Features', JSON.stringify(feature), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * updates the feature group
   */
  public putFeatureGroup(featureGroup: FeatureGroup) {
    let featureGroupJson = JSON.stringify({
      name: featureGroup.name, members: featureGroup.members,
      enabledFeatures: featureGroup.enabledFeatures
    });
    return this.featureToggleApiService.putUrl('/Api/featureGroups/' + featureGroup.id + '/', JSON.stringify({featureGroupJson}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * updates the user in feature group
   */
  public putUserInFeatureGroup(id: any, featureId: number) {
    return this.featureToggleApiService.putUrl('/Api/Users/' + id + '/FeatureGroup/' + featureId, JSON.stringify({}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * updates the feature
   */
  public putFeature(feature: Feature) {
    let featureJson = JSON.stringify({name: feature.name , parent: feature.parent});
    return this.featureToggleApiService.putUrl('/Api/Features/' + feature.id + '/', featureJson, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Delete feature group by id.
   */
  public deleteFeatureGroup(id: number) {
    return this.featureToggleApiService.deleteUrl('/Api/FeatureGroups/' + id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Delete feature by id.
   */
  public deleteFeature(id: number) {
    return this.featureToggleApiService.deleteUrl('/Api/Features/' + id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

}

