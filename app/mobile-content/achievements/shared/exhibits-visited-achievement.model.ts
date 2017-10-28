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
        public count: number,
        public imageUrl?: string,
        public timestamp?: string
    ) { super(id, title, description, points, type, status, imageUrl, timestamp); }

    // Return empty achievement
    
    public static emptyExhibitsVisitedAchievement(): ExhibitsVisitedAchievement {
        return new ExhibitsVisitedAchievement(-1,'','',0,'',status='DRAFT',0,'','');
    }
}
