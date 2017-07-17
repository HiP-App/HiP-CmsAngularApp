type fontFamily = 'DEFAULT' | 'AlteSchwabacher';
type pageType = 'Appetizer_Page' | 'Image_Page' | 'Slider_Page' | 'Text_Page';
type sliderImage = { date: string, image: number };

import { statusType } from '../../shared/status.model';

export class MobilePage {
  static readonly fontFamilies = ['DEFAULT', 'AlteSchwabacher'];
  static readonly pageTypeValues = ['Appetizer_Page', 'Image_Page', 'Slider_Page', 'Text_Page'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public text = '',
              public type: pageType = 'Appetizer_Page',
              public title = '',
              public description = '',
              public fontFamily: fontFamily = 'DEFAULT',
              public audio?: number,
              public image?: number,
              public images?: sliderImage[],
              public hideYearNumbers?: boolean,
              public additionalInformationPages: number[] = [],
              public status: statusType = 'DRAFT',
              public used = false) {}

  static parseObject(obj: any): MobilePage {
    return Object.assign(new MobilePage(), obj);
  }

  static parseObjectArray(items: any[]): MobilePage[] {
    let pages = new Array<MobilePage>();
    for (let page of items) {
      pages.push(MobilePage.parseObject(page));
    }
    return pages;
  }

  isAppetizerPage(): boolean {
    return this.type === 'Appetizer_Page';
  }

  isImagePage(): boolean {
    return this.type === 'Image_Page';
  }

  isPublished(): boolean {
    return this.status === 'PUBLISHED';
  }

  isSliderPage(): boolean {
    return this.type === 'Slider_Page';
  }

  isTextPage(): boolean {
    return this.type === 'Text_Page';
  }
}
