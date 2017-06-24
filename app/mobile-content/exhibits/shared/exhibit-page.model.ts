type fontFamily = 'DEFAULT' | 'AlteSchwabacher';
type pageType = 'APPETIZER_PAGE' | 'IMAGE_PAGE' | 'SLIDER_PAGE' | 'TEXT_PAGE';
type sliderImage = { date: string, image: number };

import { statusType } from '../../shared/status.model';

export class ExhibitPage {
  static readonly pageTypeValues = ['APPETIZER_PAGE', 'IMAGE_PAGE', 'SLIDER_PAGE', 'TEXT_PAGE'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public text = '',
              public exhibitId = -1,
              public type: pageType = 'APPETIZER_PAGE',
              public title = '',
              public description = '',
              public fontFamily: fontFamily = 'DEFAULT',
              public audio?: number,
              public image?: number,
              public images: sliderImage[] = [],
              public hideYearNumbers = false,
              public additionalInformationPages: number[] = [],
              public status: statusType = 'DRAFT') {}

  static getDummyArray() {
    let array = new Array<ExhibitPage>();
    array[0] = new ExhibitPage('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
    array[0].id = 1;
    array[0].title = 'Page about stuff';
    array[1] = new ExhibitPage('Proin iaculis diam magna, eu auctor ante interdum sit amet...');
    array[1].id = 2;
    array[1].type = 'IMAGE_PAGE';
    array[1].title = 'Page with an image';
    array[2] = new ExhibitPage('Nulla molestie convallis efficitur. Fusce vitae felis posuere nunc...');
    array[2].id = 4;
    array[2].type = 'SLIDER_PAGE';
    array[2].title = 'This page contains slider images';
    array[2].images = [{ date: '1998', image: 44}, { date: '2003', image: 90}, { date: '2012', image: 145}];
    array[3] = new ExhibitPage('Aenean quam nulla, blandit nec nisi in, aliquam vulputate justo...');
    array[3].id = 6;
    array[3].title = 'Only text here';
    array[3].type = 'TEXT_PAGE';
    return array;
  }

  static parseObject(obj: Object): ExhibitPage {
    return Object.assign(new ExhibitPage(), obj);
  }

  static parseObjectArray(items: Object[]): ExhibitPage[] {
    let pages = new Array<ExhibitPage>();
    for (let page of items) {
      pages.push(ExhibitPage.parseObject(page));
    }
    return pages;
  }
}
