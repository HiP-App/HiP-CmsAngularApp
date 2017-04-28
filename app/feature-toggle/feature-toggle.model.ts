import { Response } from '@angular/http';

export class Feature {

}

export class FeatureGroup {
  id: number;
  name: string;
  members: any;
  enabledFeatures: any;

  public static extractData(res: Response): FeatureGroup[] {
    let body = res.json();
    let featureGroups: FeatureGroup[] = [];
    for (let featureGroupData of body) {
      featureGroups.push(featureGroupData);
    }
    return featureGroups;
  }
}

export class FeatureToggle {

}
