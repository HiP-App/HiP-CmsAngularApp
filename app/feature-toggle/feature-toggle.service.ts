import { Injectable } from '@angular/core';

import { Feature } from './manage-features/feature.model';
import { FeatureGroup } from './manage-feature-groups/feature-group.model';
import { FeatureToggleApiService } from '../shared/api/featuretoggle-api.service';

/**
 * Service which does feature toggle related api calls
 */
@Injectable()
export class FeatureToggleService {

  constructor(private featureToggleApiService: FeatureToggleApiService) {}

  /**
   * Get all feature groups.
   * @return an array containing all feature groups
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
   * Get a feature group by id.
   * @param id of the feature group
   * @return the feature group
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
   * @return an array containing all features
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
   * @param id the id of the feature
   * @return the feature
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
   * Get the enabled features enabled for the current user.
   * @return the enabled feature toggles
   */
  public getEnabledFeaturesForCurrentUser(id: number) {
    return this.featureToggleApiService.getUrl('/Api/Features/IsEnabled', {})
      .toPromise()
      .then(
        (response: any) => Feature.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Returns whether the feature is enabled for the current user.
   * @param featureId the feature id
   * @return true if and only if the feature is enabled for the current user
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

  /**
   * Creates a FeatureGroup.
   * @param featureGroup the feature group to save
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
   * Creates a Feature.
   * @param feature the feature to save
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
   * Updates the feature group.
   * @param featureGroup the feature group to update
   */
  public putFeatureGroup(featureGroup: FeatureGroup) {
    let featureGroupJson = JSON.stringify({
      name: featureGroup.name, members: featureGroup.members,
      enabledFeatures: featureGroup.enabledFeatures
    });
    return this.featureToggleApiService.putUrl('/Api/FeatureGroups/' + featureGroup.id + '/', JSON.stringify({featureGroupJson}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Adds a user to a feature group.
   * @param userId the user id
   * @param featureId the feature id
   */
  public putUserInFeatureGroup(userId: any, featureId: number) {
    return this.featureToggleApiService.putUrl('/Api/Users/' + userId + '/FeatureGroup/' + featureId, JSON.stringify({}), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates the feature.
   * @param feature the feature to update
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
   * @param id the id of the feature group to delete
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
   * @param id the feature to delete.
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

