import { Response } from '@angular/http';

/** Represents a tag for the text annotation system. */
export class Tag {
  public static layers: string[] = ['Perspektive', 'Raum', 'Zeit'];
  public id: number = -1;    // default value for new tags. actual id is assigned by the server
  public tagIsVisible = true;

  /** Returns a dummy {Tag} object. */
  public static emptyTag(): Tag {
    return new Tag('', '', '', '');
  }

  /** Extracts a single {Tag} instance from a {Response} object. */
  public static extractTag(response: Response): Tag {
    let body = response.json();
    return Tag.parseJSON(body);
  }

  /** Extracts an array of tags from a {Response} object. */
  public static extractTagArray(response: Response): Tag[] {
    let body = response.json();
    let tags = new Array<Tag>();
    if (body) {
      for (let tag of body) {
        tags.push(Tag.parseJSON(tag));
      }
    }
    return tags;
  }

  /** Compares two tags by name alphabetically. Used for tag sorting. */
  public static tagAlphaCompare(a: Tag, b: Tag): number {
    return a.name.localeCompare(b.name);
  }

  /** Parses JSON input as a {Tag} object. */
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
   * @param name Name of the tag
   * @param shortName Tag's short name
   * @param layer Layer to which the tag belongs
   * @param description Tag description
   * @param style (optional) Tag's background color in hex triplet format. Defaults to yellow (#FFFF00)
   * @param isDeleted (optional) Is the tag deleted. Defaults to false
   * @param usageCount (optional) How many times the tag has been used. Defaults to zero
   * @param parentId (optional) id of the parent tag. Defaults to undefined
   * @param childId (optional) Array of ids of child tags. Defaults to empty array
   */
  constructor(public name: string,
              public shortName: string,
              public layer: string,
              public description: string,
              public style = '#FFFF00',
              public isDeleted = false,
              public usageCount = 0,
              public parentId?: number,
              public childId: number[] = []) {}

  /** Checks if this tag has child tags. */
  public hasSubtags(): boolean {
    return this.childId.length > 0;
  }

  /** Checks if this tag is a child of another tag. */
  public isSubtag(): boolean {
    return this.parentId !== undefined && this.parentId > -1;
  }

  public toggleVisibility() {
    this.tagIsVisible = !this.tagIsVisible;
  }
}
