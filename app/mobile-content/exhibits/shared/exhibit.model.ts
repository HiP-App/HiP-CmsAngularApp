import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Exhibit {
  /**
   * Creates a new exhibit object.
   * @param name (required) Name of the exhibit.
   * @param description (optional) Description of the exhibit.
   * @param image (optional) id of the associated image.
   * @param latitude (optional) Latitude of geographical location in signed decimal degrees format.
   * @param longitude (optional) Longitude of geographical location in signed decimal degrees format.
   * @param tags (optional) Array of associated tag ids.
   * @param status (optional) Status of the exhibit (draft, in review or published).
   * @param used (optional) whether the exhibit is referenced in some exhibit.
   */
  constructor(public id: number,
              public name: string,
              public description: string,
              public latitude: string,
              public longitude: string,
              public image?: number,
              public tags: any[] = [],
              public pages: number[] = [],
              public status: statusType = 'DRAFT',
              public used = false,
              public timestamp?: string) {}
  // Returns an empty exhibit
  public static emptyExhibit(): Exhibit {
    return new Exhibit(-1, '', '', '', '');
  }

  // Extracts the exhibit data from the JSON response
  public static extractExhibit(response: Response): Exhibit {
    let body = response.json();
    return Exhibit.parseJSON(body);
  }

  // Extracts an array of exhibits to be used in the pagination component
  public static extractPaginatedArrayData(res: Response): Exhibit[] {
    let body = res.json();
    let exhibits: Exhibit[] = [];
    if (body.items === undefined) {
      return exhibits;
    }
    for (let exhibit of body.items) {
      exhibits.push(this.parseJSON(exhibit));
    }
    return exhibits || [];
  }
  // Parses server response
  static parseJSON(obj: any): Exhibit {
    let exhibit = Exhibit.emptyExhibit();
    exhibit.id = obj.id;
    exhibit.name = obj.name;
    exhibit.description = obj.description;
    exhibit.latitude = obj.latitude;
    exhibit.longitude = obj.longitude;
    exhibit.image = obj.image;
    exhibit.status = obj.status;
    exhibit.tags = obj.tags;
    exhibit.pages = obj.pages;
    exhibit.timestamp = obj.timestamp;
    return exhibit;
  }
  // Sorts the Exhibits by name
  public static exhibitAlphaCompare(a: Exhibit, b: Exhibit): number {
    return a.name.localeCompare(b.name);
  }

  public isValid(): boolean {
    return this.name && this.name.trim().length > 3;
  }
}
