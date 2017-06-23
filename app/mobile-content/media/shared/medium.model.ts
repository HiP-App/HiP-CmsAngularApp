import { statusType } from '../../shared/status.model';

export type mediaType = 'audio' | 'image';
export type MediaTypeForSearch = 'ALL' | mediaType ;

export class Medium {
  public static readonly types = ['audio', 'image'];

  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  constructor(public title = '',
              public description = '',
              public type: mediaType = 'image',
              public status: statusType = 'DRAFT',
              public used = false) {}

  public isValid() {
    return this.title && this.title.trim().length > 3;
  }
}

