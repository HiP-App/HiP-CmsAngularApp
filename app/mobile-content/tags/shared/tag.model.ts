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
    return new Tag(-1, '', '', 0 , 'DRAFT', '', false);
  }

  public static extractData(res: Response): Tag {
    let body = res.json();
    return this.parseJSON(body);
  }

  /** Extracts an array of tags from a {Response} object. */
  public static extractTagArray(response: Response): Tag[] {
    let body = response.json();
    let tags = new Array<Tag>();
    if (body) {
      for (let tag of body.items) {
        tags.push(Tag.parseJSON(tag));
      }
    }
    return tags;
  }

  public static extractPaginatedArrayData(res: Response): Tag[] {
    let body = res.json();
    let tags: Tag[] = [];
    if (body.items === undefined) {
      return tags;
    }
    for (let topic of body.items) {
      tags.push(this.parseJSON(topic));
    }
    return tags || [];
  }

  /** Parses JSON input as a {Tag} object. */
  private static parseJSON(obj: any): Tag {
    let tag = Tag.emptyTag();
    tag.id = obj.id;
    tag.description = obj.description;
    tag.image = obj.image;
    tag.title = obj.title;
    tag.timestamp = obj.timestamp;
    tag.used = obj.used;
    return tag;
  }
}
