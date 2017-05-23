import { Injectable } from '@angular/core';

import { FeatureGroup } from './feature-group.model';
import { FeatureToggleApiService } from '../../../shared/api/featuretoggle-api.service';

/**
 * Service which does feature toggle related api calls
 */
@Injectable()
export class FeatureGroupService {

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
        (error: any) => FeatureGroupService.handleError(error)
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
        (error: any) => FeatureGroupService.handleError(error)
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
        (error: any) => FeatureGroupService.handleError(error)
      );
  }

  /**
   * Updates the feature group.
   * @param featureGroup the feature group to update
   */
  public updateFeatureGroup(featureGroup: FeatureGroup) {
    let featureGroupJson = JSON.stringify({
      name: featureGroup.name,
      enabledFeatures: featureGroup.enabledFeatures,
      members: featureGroup.members
    });
    return this.featureToggleApiService.putUrl('/Api/FeatureGroups/' + featureGroup.id + '/', featureGroupJson, {})
      .toPromise()
      .catch(
        (error: any) => FeatureGroupService.handleError(error)
      );
  }

  /**
   * Delete the feature group with the given id.
   * @param id the id of the feature group to delete
   */
  public deleteFeatureGroup(id: number) {
    return this.featureToggleApiService.deleteUrl('/Api/FeatureGroups/' + id, {})
      .toPromise()
      .then(
        (response: any) => response
      ).catch(
        (error: any) => FeatureGroupService.handleError(error)
      );
  }

  /**
   * Adds a user to a the feature group.
   * @param userId the user id
   * @param featureGroupId the id of the feature group
   */
  public addUserToFeatureGroup(userId: number, featureGroupId: number) {
    return this.featureToggleApiService.putUrl('/Api/Users/' + userId + '/FeatureGroup/' + featureGroupId, '', {})
      .toPromise()
      .catch(
        (error: any) => FeatureGroupService.handleError(error)
      );
  }

  private static handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

}

