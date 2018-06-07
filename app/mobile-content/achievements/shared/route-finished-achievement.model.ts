import { Achievement } from './achievement.model';
import { statusType } from '../../shared/status.model';

export class RouteFinishedAchievement extends Achievement {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public points: number,
        public type: string,
        public status: statusType = 'DRAFT',
        // tslint:disable-next-line:no-inferrable-types
        public routeId: number,
        public imageUrl?: string,
        public timestamp?: string
    ) { super(id, title, description, points, type, status, imageUrl, timestamp); }

    // Return empty achievement

    public static emptyRouteFinishedAchievement(): RouteFinishedAchievement {
        return new RouteFinishedAchievement(-1, '', '', 0, '', status = 'DRAFT', null, '', '');
    }
    static parseJSON(obj: any): RouteFinishedAchievement {
        let routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
        routeFinishedAchievement.id = obj.id;
        routeFinishedAchievement.title = obj.title;
        routeFinishedAchievement.description = obj.description;
        routeFinishedAchievement.points = obj.points;
        routeFinishedAchievement.type = obj.type;
        routeFinishedAchievement.status = obj.status;
        routeFinishedAchievement.routeId = obj.routeId;
        routeFinishedAchievement.imageUrl = obj.imageUrl;
        routeFinishedAchievement.timestamp = obj.timestamp;
        return routeFinishedAchievement;
    }
}
