import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { CmsApiService } from '../core/api/cms-api.service';
import { FeatureGroup } from './feature-toggle.model';

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
    return this.cmsApiService.getUrl('/Api/FeatureGroups', {})
      .toPromise()
      .then(
        (response: any) => FeatureGroup.extractData(response)
      ).catch(
        (error: any) => this.handleError('Error during fetching all notifications', error)
      );
  }

  private handleError(method: string, error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }

}
