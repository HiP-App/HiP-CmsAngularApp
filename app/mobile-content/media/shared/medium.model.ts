import { statusType } from '../../shared/status.model';

export type mediaType = 'Audio' | 'Image';
export type MediaTypeForSearch = 'ALL' | mediaType ;

export class Medium {
  public static readonly types = ['Audio', 'Image'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public title = '',
              public description = '',
              public type: mediaType = 'Image',
              public status: statusType = 'DRAFT',
              public used = false) {}

  public isValid(): boolean {
    return this.title && this.title.trim().length > 3;
  }
}

