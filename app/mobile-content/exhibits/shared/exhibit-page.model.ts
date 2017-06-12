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
              public type: pageType,
              public title: string,
              public description: string,
              public fontFamily: string,
              public audio: number,
              public image: number,
              public images: sliderImage[],
              public hideYearNumbers: boolean,
              public additionalInformationPages: number[],
              public status: statusType) {}

  static getDummyArray() {
    return [
      new ExhibitPage('blalala', 2, 'APPETIZER_PAGE', 'Page about stuff', '', '', 1, 1, null, false, [], 'DRAFT'),
      new ExhibitPage('hhallsfsas', 2, 'SLIDER_PAGE', 'Page about other stuff', '', '', null, null, [
        { date: '2003', image: 56},
        { date: '2005', image: 32},
        { date: '2006', image: 123},
        { date: '2007', image: 777},
      ], false, [], 'DRAFT'),
      new ExhibitPage('ggggdssss', 2, 'IMAGE_PAGE', 'An image page', '', '', null, null, [], false, [], 'DRAFT')
    ];
  }
}
