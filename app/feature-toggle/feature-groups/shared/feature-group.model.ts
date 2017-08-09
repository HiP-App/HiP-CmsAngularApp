import { Response } from '@angular/http';

/**
 * A feature group is a group of users having access to the same set of features.
 */
export class FeatureGroup {
  id: number;
  name: string;
  members: string[];
  isProtected: boolean;
  enabledFeatures: number[];

  /**
   * Creates a Feature Group.
   * @param id the id
   * @param name an unique name for the feature group
   * @param members the users who are member of this feature group
   * @param enabledFeatures the list of the ids of the features enabled for the group
   */
  constructor(id: number,
              name: string,
              members: string[],
              isProtected: boolean,
              enabledFeatures: number[]) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.isProtected = isProtected;
    this.enabledFeatures = enabledFeatures;
  }

  /**
   * Extract the feature groups from a JSON array containing feature groups.
   *
   * @param res the response
   * @returns {FeatureGroup[]} an array of feature groups
   */
  public static extractData(res: Response): FeatureGroup[] {
    let body = res.json();
    let featureGroups: FeatureGroup[] = [];
    for (let obj of body) {
      featureGroups.push(FeatureGroup.parseJSON(obj));
    }
    return featureGroups;
  }

  /**
   * Extract feature group from JSON object.
   *
   * @param obj the object
   * @returns {FeatureGroup} the feature group
   */
  public static parseJSON(obj: any): FeatureGroup {
    let featureGroup = FeatureGroup.emptyFeatureGroup();
    if (obj.id) {
      featureGroup.id = obj.id;
    }
    if (obj.name) {
      featureGroup.name = obj.name;
    }
    if (obj.members) {
      featureGroup.members = obj.members;
    }
    if (obj.isProtected) {
      featureGroup.isProtected = obj.isProtected;
    }
    if (obj.enabledFeatures) {
      featureGroup.enabledFeatures = obj.enabledFeatures;
    }
    return featureGroup;
  }

  /**
   * Returns a dummy {FeatureGroup} object.
   *
   * @returns {FeatureGroup}
   */
  public static emptyFeatureGroup(): FeatureGroup {
    return new FeatureGroup(-1, '', [], false, []);
  }

  public isFeatureEnabled(featureId: number) {
    return this.enabledFeatures && this.enabledFeatures.includes(featureId);
  }

  public isValid(): boolean {
    return this.name && this.name.trim().length > 2;
  }
}

