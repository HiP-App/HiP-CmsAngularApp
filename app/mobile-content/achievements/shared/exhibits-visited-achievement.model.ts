import { Achievement } from './achievement.model';
import { statusType } from '../../shared/status.model';

export class ExhibitsVisitedAchievement extends Achievement {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public points: number,
        public type: string,
        public status: statusType = 'DRAFT',
        // tslint:disable-next-line:no-inferrable-types
        public count: number = 10,
        public imageUrl?: string,
        public timestamp?: string
    ) { super(id, title, description, points, type, status, imageUrl, timestamp); }

    // Return empty achievement

    public static emptyExhibitsVisitedAchievement(): ExhibitsVisitedAchievement {
        return new ExhibitsVisitedAchievement(-1, '', '', 100, '', status = 'DRAFT', 10, '', '');
    }

    static parseJSON(obj: any): ExhibitsVisitedAchievement {
        let exihibitvisitedachievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
        exihibitvisitedachievement.id = obj.id;
        exihibitvisitedachievement.title = obj.title;
        exihibitvisitedachievement.description = obj.description;
        exihibitvisitedachievement.points = obj.points;
        exihibitvisitedachievement.type = obj.type;
        exihibitvisitedachievement.status = obj.status;
        exihibitvisitedachievement.count = obj.count;
        exihibitvisitedachievement.imageUrl = obj.imageUrl;
        exihibitvisitedachievement.timestamp = obj.timestamp;
        return exihibitvisitedachievement;
    }
    public isValid(): boolean {
        return this.title && this.title.trim().length > 3;
    }
}
