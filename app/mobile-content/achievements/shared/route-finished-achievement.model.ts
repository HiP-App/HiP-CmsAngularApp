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
        public routeId: number,
        public imageUrl?: string,
        public timestamp?: string
    ) { super(id, title, description, points, type, status, imageUrl, timestamp); }

    // Return empty achievement
    
    public static emptyRouteFinishedAchievement(): RouteFinishedAchievement {
        return new RouteFinishedAchievement(-1,'','',0,'',status='DRAFT',0,'','');
    }
    static parseJSON(obj: any): RouteFinishedAchievement {
        let achievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
        achievement.id = obj.id;
        achievement.title = obj.title;
        achievement.description = obj.description;
        achievement.points = obj.points;
        achievement.type = obj.type;
        achievement.status = obj.status;
        achievement.routeId = obj.routeId;
        achievement.imageUrl = obj.imageUrl;
        achievement.timestamp = obj.timestamp;
        return achievement;
      }
}
