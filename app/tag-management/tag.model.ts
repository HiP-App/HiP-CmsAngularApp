import { Response } from '@angular/http';

/**
 * Represents a tag for the text annotation system.
 */
export class Tag {
  public id: number = -1;    // default value. actual id is assigned by the server

  /**
   * Returns a dummy {Tag} object.
   * 
   * @returns {Tag} A dummy tag.
   */
  public static emptyTag(): Tag {
    return new Tag('', '', '', '', '');
  }

  /**
   * Extracts a single {Tag} instance from a {Response} object.
   */
  public static extractTag(response: Response): Tag {
    let body = response.json();
    return Tag.parseJSON(body);
  }

  /**
   * Extracts an array of tags from a {Response} object.
   */
  public static extractTagArray(response: Response): Tag[] {
    let body = response.json();
    let tags: Tag[] = [];
    if (body === undefined) {
      return tags;
    }
    for (let tag of body) {
      tags.push(Tag.parseJSON(tag));
    }
    return tags || [];
  }

  /**
   * Parses JSON input as a {Tag} object.
   */
  private static parseJSON(obj: any): Tag {
    let tag = Tag.emptyTag();
    tag.id = obj.tagId;
    tag.name = obj.name;
    tag.shortName = obj.shortName;
    tag.layer = obj.layer;
    tag.style = obj.style;
    tag.description = obj.description;
    tag.isDeleted = obj.isDeleted;
    tag.usageCount = obj.usageCount;
    tag.parentId = obj.parentId;
    tag.childId = obj.childId;
    return tag;
  }

  /**
   * Tag constructor.
   * 
   * @param name tag name
   * @param shortName short tag name
   * @param layer layer
   * @param style style
   * @param description tag description
   * @param isDeleted (optional) is the tag deleted. defaults to false.
   * @param usageCount (optional) how many times the tag has been used. defaults to zero.
   * @param parentId (optional) id of the parent tag. defaults to undefined.
   * @param childId (optional) array of ids of child tags. defaults to undefined.
   */
  constructor(public name: string,
              public shortName: string,
              public layer: string,
              public description: string,
              public style: string,
              public isDeleted = false,
              public usageCount = 0,
              public parentId?: number,
              public childId?: number[]) {}

  /**
   * Creates an x-www-formdata string from a {Tag} object
   * 
   * @returns {string} x-www-formdata string representation of a tag
   */
  public formData() {
    let data = '';
    data += 'Name=' + this.name + '&';
    data += 'ShortName=' + this.shortName + '&';
    data += 'Layer=' + this.layer + '&';
    data += 'Description=' + this.description + '&';
    data += 'Style=' + this.style;
    return data;
  }

  /**
   * Checks if this tag has child tags.
   * 
   * @returns {boolean} true if tag has child tags, false otherwise
   */
  public hasSubTags(): boolean {
    return this.childId && this.childId.length > 0;
  }

  /**
   * Checks if this tag is a child of another tag.
   * 
   * @returns {boolean} true if tag has a parent tag, false otherwise
   */
  public hasParentTag(): boolean {
    return this.parentId && this.parentId > -1;
  }
}
