import { Response } from '@angular/http';
// import { Exhibit } from '../exhibits/exhibits.model';
// import { Tag } from '../tags/tags.model';


export class Route {
    id: number;
    title: string;
    description: string;
    duration: number;
    distance: number;
    image: number;
    audio: number;
    // exhibits: Exhibit[];
    status: string;
    // tags: Tag[];
    timestamp: string;

    /** Extracts a single {Route} instance from a {Response} object. */
    public static extractRoute(response: Response): Route {
        let body = response.json();
        return Route.parseJSON(body);
    }

    /** Extracts an array of tags from a {Response} object. */
    public static extractRouteArray(response: Response): Route[] {
        let body = response.json();
        let tags = new Array<Route>();
        if (body) {
            for (let tag of body) {
                tags.push(Route.parseJSON(tag));
            }
        }
        return tags;
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
        // route.exhibits = obj.exhibits;
        route.status = obj.status;
        // route.tags = obj.tags;
        route.timestamp = obj.timestamp;
        return route;
    }
    static emptyRoute() {
        return new Route(-1, '', '', 0 , 0, 0, 0, '', '');
     }
    public static routeAlphaCompare(a: Route, b: Route): number {
        return a.title.localeCompare(b.title);
    }
    constructor( id: number,
                title: string,
                description: string,
                duration: number,
                distance: number,
                image: number,
                audio: number,
                // exhibits: Exhibit[],
                status: string,
                // tags: Tag[],
                timestamp: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.distance = distance;
        this.image = image;
        this.audio = audio;
        // this.exhibits = exhibits;
        this.status = status;
        // this.tags = tags;
        this.timestamp = timestamp;
    }
}