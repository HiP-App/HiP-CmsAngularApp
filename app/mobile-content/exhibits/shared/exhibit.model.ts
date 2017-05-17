import { contentStatus } from '../../shared/content-status.model';

export class Exhibit {
  // Server-assigned properties. Cannot be modified on client side.
  public id = -1;
  public timestamp = -1;

  /**
   * Creates a new exhibit object.
   * @param name (required) Name of the exhibit.
   * @param description (optional) Description of the exhibit.
   * @param image (optional) id of the associated image.
   * @param latitude (optional) Latitude of geographical location in signed decimal degrees format.
   * @param longitude (optional) Longitude of geographical location in signed decimal degrees format.
   * @param tags (optional) Array of associated tag ids.
   * @param status (optional) Status of the exhibit (draft, in review or published).
   */
  constructor(public name: string,
              public description?: string,
              public latitude?: number,
              public longitude?: number,
              public image?: number,
              public tags: number[] = [],
              public status: contentStatus = 'DRAFT',
              public used = false) {}

  // Returns a random dummy exhibit
  // TODO: remove this method after server side is ready
  static getRandom() {
    let x = new Exhibit('Exhibit No. ' + (Math.random() * 100).toFixed(0));
    x.description = 'Bla' + ' bla'.repeat(Math.round(Math.random() * 15));
    x.image       = Math.round(Math.random() * 100);
    x.latitude    = Number((Math.random() * 90 * (Math.random() > 0.5 ? -1 : 1)).toFixed(6));
    x.longitude   = Number((Math.random() * 180 * (Math.random() > 0.5 ? -1 : 1)).toFixed(6));
    x.id          = Math.round(Math.random() * 100);
    x.used        = Math.random() > 0.5;
    return x;
  }
}
