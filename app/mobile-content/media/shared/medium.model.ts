import { statusType } from '../../shared/status.model';

export type mediaType = 'audio' | 'image';
export type mediaTypeForSearch = 'ALL' | mediaType ;

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

  public static getRandom() {
    return new Medium(
      'Media File No. ' + (Math.random() * 100).toFixed(0),
      'Bla' + ' bla'.repeat(Math.round(Math.random() * 15)),
      Math.random() > 0.5 ? 'image' : 'audio',
      'DRAFT',
      Math.random() > 0.5
    );
  }
}
