import { statusType } from '../../shared/status.model';

export class Tag {
  id: number;
  title: string;
  description: string;
  image: number;
  status: statusType;
  timestamp: string;
  used: boolean;

  /**
   * Creates a new tag.
   * @param id the unique id of the tag
   * @param title the title of the tag
   * @param description the description
   * @param image the image file
   * @param status the Status of the tag (draft, in review or published).
   * @param timestamp
   * @param used (optional) whether the tag is referenced in some route or exhibit.
   */
  constructor(id: number,
              title: string,
              description: string,
              image: number,
              status: statusType = 'DRAFT',
              timestamp: string,
              used: boolean) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.status = status;
    this.timestamp = timestamp;
    this.used = used;
  }

  static emptyTag(): Tag {
    return new Tag(-1, '', '', 0 , 'DRAFT', '', false);
  }

  static getRandom(): Tag {
    let x = new Tag(-1, '', '', 0 , 'DRAFT', '', false);
    x.description = 'Lorem' + ' impsum'.repeat(Math.round(Math.random() * 15));
    x.image = Math.round(Math.random() * 100);
    x.title = 'Tag No. ' + (Math.random() * 100).toFixed(0);
    x.id = Math.round(Math.random() * 100);
    x.status = 'DRAFT';
    return x;
  }
}
