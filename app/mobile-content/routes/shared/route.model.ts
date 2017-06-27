import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';


export class Route {
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
  constructor(public id: number,
              public title: string,
              public description: string,
              public duration: number,
              public distance: number,
              public image?: number,
              public audio?: number,
              public exhibits?: Array<number>,
              public status?: statusType,
              public tags?: any[],
              public timestamp?: string
  ) {}

  public static emptyRoute(): Route {
    return new Route(-1, '', '', 0, 0);
  }

  public static extractRoute(response: Response): Route {
    let body = response.json();
    return Route.parseJSON(body);
  }

  public static extractPaginatedArrayData(res: Response): Route[] {
    let body = res.json();
    let routes: Route[] = [];
    if (body.items === undefined) {
      return routes;
    }
    for (let route of body.items) {
      routes.push(this.parseJSON(route));
    }
    return routes || [];
  }

  static parseJSON(obj: any): Route {
    let route = Route.emptyRoute();
    route.id = obj.id;
    route.title = obj.title;
    route.description = obj.description;
    route.duration = obj.duration;
    route.distance = obj.distance;
    route.image = obj.image;
    route.audio = obj.audio;
    route.exhibits = obj.exhibits;
    route.status = obj.status;
    route.tags = obj.tags;
    route.timestamp = obj.timestamp;
    return route;
  }
  public static routeAlphaCompare(a: Route, b: Route): number {
    return a.title.localeCompare(b.title);
  }
}
