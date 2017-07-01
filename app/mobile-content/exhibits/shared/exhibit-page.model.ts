type fontFamily = 'DEFAULT' | 'AlteSchwabacher';
type pageType = 'Appetizer_Page' | 'Image_Page' | 'Slider_Page' | 'Text_Page';
type sliderImage = { date: string, image: number };

import { statusType } from '../../shared/status.model';

export class ExhibitPage {
  static readonly fontFamilies = ['DEFAULT', 'AlteSchwabacher'];
  static readonly pageTypeValues = ['Appetizer_Page', 'Image_Page', 'Slider_Page', 'Text_Page'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public text = '',
              public exhibitId = -1,
              public type: pageType = 'Appetizer_Page',
              public title = '',
              public description = '',
              public fontFamily: fontFamily = 'DEFAULT',
              public audio?: number,
              public image?: number,
              public images?: sliderImage[],
              public hideYearNumbers?: boolean,
              public additionalInformationPages: number[] = [],
              public status: statusType = 'DRAFT') {}

  static parseObject(obj: any): ExhibitPage {
    return Object.assign(new ExhibitPage(), obj);
  }

  static parseObjectArray(items: any[]): ExhibitPage[] {
    let pages = new Array<ExhibitPage>();
    for (let page of items) {
      pages.push(ExhibitPage.parseObject(page));
    }
    return pages;
  }

  isAppetizerPage(): boolean {
    return this.type === 'Appetizer_Page';
  }

  isImagePage(): boolean {
    return this.type === 'Image_Page';
  }

  isSliderPage(): boolean {
    return this.type === 'Slider_Page';
  }

  isTextPage(): boolean {
    return this.type === 'Text_Page';
  }
}
