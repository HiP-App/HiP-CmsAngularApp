import { Response } from '@angular/http';

export class Feature {
  id: number;
  name: string;
  parent: number;
  children: number[] = [];
  groupsWhereEnabled: number[] = [];

  public static extractData(res: Response): Feature[] {
    let body = res.json();
    let features: Feature[] = [];
    for (let featureData of body) {
      features.push(featureData);
    }
    return features;
  }
}

export class FeatureGroup {
  id: number;
  name: string;
  members: string[];
  enabledFeatures: number[] = [];

  public static extractData(res: Response): FeatureGroup[] {
    let body = res.json();
    let featureGroups: FeatureGroup[] = [];
    for (let featureGroupData of body) {
      featureGroups.push(featureGroupData);
    }
    return featureGroups;
  }

  /** Returns a dummy {FeatureGroup} object. */
  public static emptyFeatureGroup(): FeatureGroup {
    return new FeatureGroup(-1, '', [''],[]);
  }

  /**
   * Constructor for a Feature Group.
   */
  constructor(id: number,
              name: string,
              members: string[],
              enabledFeatures: number[] = []
              ) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.enabledFeatures = enabledFeatures;
  }
}

export class FeatureToggle {

}
