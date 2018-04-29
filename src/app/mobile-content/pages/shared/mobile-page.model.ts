export type pageType = 'Appetizer_Page' | 'Image_Page' | 'Slider_Page' | 'Text_Page';
export type pageTypeForSearch = 'ALL' | pageType;
type fontFamilyOptions = 'DEFAULT' | 'AlteSchwabacher';
type sliderImage = { date: string, image: number };

import { statusType } from '../../shared/status.model';

export class MobilePage {
  static readonly fontFamilies = ['DEFAULT', 'AlteSchwabacher'];
  static readonly pageTypeValues = ['Appetizer_Page', 'Image_Page', 'Slider_Page', 'Text_Page'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(
              // common properties with default values
              private type: pageType = 'Appetizer_Page',
              public status: statusType = 'DRAFT',
              public used = false,

              // type-dependent properties
              public additionalInformationPages?: number[],
              public audio?: number,
              public description?: string,
              public fontFamily?: fontFamilyOptions,
              public hideYearNumbers?: boolean,
              public image?: number,
              public images?: sliderImage[],
              public text?: string,
              public title?: string
            ) {}

  get pageType(): pageType {
    return this.type;
  }

  set pageType(value: pageType) {
    // reset all properties except the following:
    let keptProperties = ['id', 'timestamp', 'status', 'type', 'used'];
    for (let prop of Object.keys(this)) {
      if (!keptProperties.includes(prop)) {
        this[prop] = undefined;
      }
    }

    // initialize properties based on page type. numeric properties stay undefined
    switch (value) {
      case 'Appetizer_Page':
        this.text = '';
        break;
      case 'Image_Page':
        this.additionalInformationPages = [];
        break;
      case 'Slider_Page':
        this.additionalInformationPages = [];
        this.hideYearNumbers = false;
        this.images = [];
        this.text = '';
        this.title = '';
        break;
      case 'Text_Page':
        this.additionalInformationPages = [];
        this.description = '';
        this.fontFamily = 'DEFAULT';
        this.text = '';
        this.title = '';
        break;
    }

    this.type = value;
  }

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

  getPreviewId(): number {
    let previewId = -1;
    if (this.image != null) {
      previewId = this.image;
    } else if (this.images && this.images.length > 0) {
      previewId = this.images[0].image;
    }
    return previewId;
  }

  hasInfoPages(): boolean {
    return this.additionalInformationPages && this.additionalInformationPages.length > 0;
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
