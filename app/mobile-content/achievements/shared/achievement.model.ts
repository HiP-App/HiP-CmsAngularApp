import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Achievement {

    constructor(
        public id: number,
        public name: string,
        public description: string,
        public type: string,
        public status: statusType = 'DRAFT',
        public image?: number,
        public timestamp?: string
    ) { }

    public static emptyAchievement(): Achievement {
        return new Achievement(-1, '', '', '');
    }

    public static extractAchievement(response: Response): Achievement {
        let body = response.json();
        return Achievement.parseJSON(body);
    }

    static parseJSON(obj: any): Achievement {
        let achievement = Achievement.emptyAchievement();
        achievement.id = obj.id;
        achievement.name = obj.name;
        achievement.description = obj.description;
        achievement.type = obj.type;
        achievement.status = obj.status;
        achievement.image = obj.image;
        achievement.timestamp = obj.timestamp;
        return achievement;
    }
}