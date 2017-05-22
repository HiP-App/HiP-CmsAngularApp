import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { statusType } from '../../shared/status.model';

export class Route {
  id: number;
  title: string;
  description: string;
  duration: number;
  distance: number;
  image: number;
  audio: number;
  exhibits: Exhibit[];
  status: statusType;
  tags: string[];
  timestamp: string;

  /**
   * Creates a new route.
   * @param id the unique id of the route
   * @param title the title of the route
   * @param description the description
   * @param duration the duration
   * @param distance the distance
   * @param image the image file
   * @param audio the audio file
   * @param exhibits the exhibits included in the route
   * @param status the Status of the route (draft, in review or published).
   * @param tags the tags assigned to the route
   * @param timestamp
   */
  constructor( id: number,
               title: string,
               description: string,
               duration: number,
               distance: number,
               image: number,
               audio: number,
               exhibits: Exhibit[],
               status: statusType = 'DRAFT',
               tags: string[],
               timestamp: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.distance = distance;
    this.image = image;
    this.audio = audio;
    this.exhibits = exhibits;
    this.status = status;
    this.tags = tags;
    this.timestamp = timestamp;
  }

  static emptyRoute() {
    return new Route(-1, '', '', 0 , 0, 0, 0, [], 'DRAFT', [], '');
  }

  static getRandom() {
    let x = new Route(-1, '', '', 0 , 0, 0, 0, [], 'DRAFT', [], '');
    x.description = 'Lorem' + ' impsum'.repeat(Math.round(Math.random() * 15));
    x.image = Math.round(Math.random() * 100);
    x.title = 'Route No. ' + (Math.random() * 100).toFixed(0);
    x.id = Math.round(Math.random() * 100);
    x.audio = Math.random();
    x.duration = Math.round(Math.random() * 100);
    x.distance = Math.round(Math.random() * 100);
    if (Math.random() > 0.5) {
      x.tags = ['bar', 'restaurant'];
    } else if (Math.random() > 0.5) {
      x.tags = ['bar'];
    }
    x.status = 'PUBLISHED';
    for (let i = 0; i < (Math.random() * 10) + 3; i++) {
      x.exhibits.push(Exhibit.getRandom());
    }
    return x;
  }
}
