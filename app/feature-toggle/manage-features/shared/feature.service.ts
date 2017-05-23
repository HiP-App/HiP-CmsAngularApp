import { Injectable } from '@angular/core';

import { Feature } from './feature.model';
import { FeatureToggleApiService } from '../../../shared/api/featuretoggle-api.service';

/**
 * Service which does feature toggle related api calls
 */
@Injectable()
export class FeatureService {

  constructor(private featureToggleApiService: FeatureToggleApiService) {}

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
        (error: any) => FeatureService.handleError(error)
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
        (error: any) => FeatureService.handleError(error)
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
        (error: any) => FeatureService.handleError(error)
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
   * Creates a Feature.
   * @param feature the feature to save
   */
  public createFeature(feature: Feature) {
    return this.featureToggleApiService.postUrl('/Api/Features', JSON.stringify(feature), {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => FeatureService.handleError(error)
      );
  }

  /**
   * Updates the feature.
   * @param feature the feature to update
   */
  public updateFeature(feature: Feature) {
    let featureJson = JSON.stringify({name: feature.name , parent: feature.parent});
    return this.featureToggleApiService.putUrl('/Api/Features/' + feature.id + '/', featureJson, {})
      .toPromise()
      .catch(
        (error: any) => FeatureService.handleError(error)
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
        (error: any) => FeatureService.handleError(error)
      );
  }

  /**
   * Enables the feature for the given group.
   * @param featureId the id of the feature to enable.
   * @param groupId the id of the group to enable for the feature for.
   * @returns {Promise<void>}
   */
  public enableFeatureForGroup(featureId: number, groupId: number) {
    return this.featureToggleApiService.putUrl('/Api/Features/' + featureId + '/Group' + groupId, '', {})
      .toPromise()
      .catch(
        (error: any) => FeatureService.handleError(error)
      );
  }

  /**
   * Disables the feature for the given group.
   * @param featureId the id of the feature to disable.
   * @param groupId the id of the group to disable for the feature for.
   * @returns {Promise<void>}
   */
  public disableFeatureForGroup(featureId: number, groupId: number) {
    return this.featureToggleApiService.deleteUrl('/Api/Features/' + featureId + '/Group' + groupId, {})
      .toPromise()
      .catch(
        (error: any) => FeatureService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

}

