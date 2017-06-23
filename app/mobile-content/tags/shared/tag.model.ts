import { Response } from '@angular/http';

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
    return new Tag(-1, '', '', null, 'DRAFT', '', false);
  }

  public static extractData(res: Response): Tag {
    let body = res.json();
    return this.parseJSON(body);
  }

  public static extractPaginatedArrayData(res: Response): Tag[] {
    let body = res.json();
    let tags: Tag[] = [];
    if (body.items === undefined) {
      return tags;
    }
    for (let tag of body.items) {
      tags.push(this.parseJSON(tag));
    }
    return tags || [];
  }

  /**
   * Parses JSON input as a {Tag} object.
   * @param obj the JSON object
   * */
  private static parseJSON(obj: any): Tag {
    let tag = Tag.emptyTag();
    tag.id = obj.id;
    tag.title = obj.title;
    tag.description = obj.description;
    tag.image = obj.image;
    tag.status = obj.status;
    tag.timestamp = obj.timestamp;
    tag.used = obj.used;
    return tag;
  }

  public isValid(): boolean {
    return this.title && this.title.trim().length > 3;
  }
}
