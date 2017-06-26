type pageType = 'APPETIZER_PAGE' | 'IMAGE_PAGE' | 'SLIDER_PAGE';
type sliderImage = { date: string, image: number };

import { statusType } from '../../shared/status.model';

export class ExhibitPage {
  static readonly pageTypeValues = ['APPETIZER_PAGE', 'IMAGE_PAGE', 'SLIDER_PAGE'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public text: string,
              public exhibitId: number,
              public status: statusType,
              public type: pageType,
              public audio: number,
              public image: number,
              public images: sliderImage[],
              public hideYearNumbers: boolean) {}
  }
