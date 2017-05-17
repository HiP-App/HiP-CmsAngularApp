import { Response } from '@angular/http';

import { Feature } from '../manage-features/feature.model';

/**
 * A feature group is a group of users having access to the same set of features.
 */
export class FeatureGroup {
  id: number;
  name: string;
  members: string[];
  enabledFeatures: Feature[];

  /**
   * Creates a Feature Group.
   * @param id the id
   * @param name an unique name for the feature group
   * @param members the users who are members of this feature group
   * @param enabledFeatures the list of features enabled for the group
   */
  constructor(id: number,
              name: string,
              members: string[],
              enabledFeatures: Feature[]) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.enabledFeatures = enabledFeatures;
  }

  /**
   * Extract features from an JSON array containing features.
   *
   * @param res the response
   * @returns {FeatureGroup[]} an array of feature groups
   */
  public static extractData(res: Response): FeatureGroup[] {
    let body = res.json();
    let featureGroups: FeatureGroup[] = [];
    for (let featureGroupData of body) {
      featureGroups.push(featureGroupData);
    }
    return featureGroups;
  }

  /**
   * Returns a dummy {FeatureGroup} object.
   *
   * @returns {FeatureGroup}
   */
  public static emptyFeatureGroup(): FeatureGroup {
    return new FeatureGroup(-1, '', [''], []);
  }
}

