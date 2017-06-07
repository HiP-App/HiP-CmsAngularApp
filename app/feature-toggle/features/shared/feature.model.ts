import { Response } from '@angular/http';

/**
 * This class represents a feature. Features can be organized in an hierarchy.
 * They can be enabled for FeatureGroups.
 */
export class Feature {
  id: number;
  name: string;
  parent: number;
  children: number[] = [];
  groupsWhereEnabled: number[] = [];

  /**
   * Constructor for a Feature.
   *
   * @param id the id
   * @param name the name
   * @param parent the id of the parent feature,
   * @param children the ids of the children
   * @param groupsWhereEnabled the ids of group the feature is enabled for
   */
  constructor(id: number,
              name: string,
              parent?: number,
              children: number[] = [],
              groupsWhereEnabled: number[] = []) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.children = children;
    this.groupsWhereEnabled = groupsWhereEnabled;
  }

  /**
   * Extract features from an JSON array containing features.
   *
   * @param res the response
   * @returns {Feature[]} an array of features
   */
  public static extractData(res: Response): Feature[] {
    let body = res.json();
    let features: Feature[] = [];
    for (let featureData of body) {
      features.push(featureData);
    }
    return features;
  }

  /**
   * Returns a dummy {Feature} object.
   *
   * @returns {Feature}
   */
  public static emptyFeature(): Feature {
    return new Feature(-1, '', null, [], []);
  }

  public isValid(): boolean {
    return this.name.trim().length > 2;
  }
}
