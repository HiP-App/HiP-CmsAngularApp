import { Response } from '@angular/http';
import { Exhibit } from '../exhibits/shared/exhibit.model';
// import { Tag } from '../tags/tags.model';


export class Route {
    /** Extracts a single {Route} instance from a {Response} object. */
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
        for (let topic of body.items) {
            routes.push(this.parseJSON(topic));
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
        // route.tags = obj.tags;
        route.timestamp = obj.timestamp;
        return route;
    }
    public static emptyRoute(): Route {
        return new Route(-1, '', '', 0, 0);
    }
    public static routeAlphaCompare(a: Route, b: Route): number {
        return a.title.localeCompare(b.title);
    }
    /*constructor( id: number,
                title: string,
                description: string,
                duration: number,
                distance: number,
                image: number,
                audio: number,
                // exhibits: Exhibit[],
                status: string,
                // tags: Tag[],
                timestamp: string) {}*/

    constructor(public id: number,
                public title: string,
                public description: string,
                public duration: number,
                public distance: number,
                public image?: number,
                public audio?: number,
                public exhibits?: Exhibit[],
                public status?: string,
                // public tags?: Tag[],
                public timestamp?: string
                ) {}
}