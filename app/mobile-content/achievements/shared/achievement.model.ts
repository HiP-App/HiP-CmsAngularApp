import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Achievement {

    constructor(
        public id: number,
        public title: string,
        public description: string,
        public points: number,
        public type: string,
        public status: statusType = 'DRAFT',
        public image?: number,
        public timestamp?: string
    ) { }

    public static emptyAchievement(): Achievement {
        return new Achievement(-1, '', '', -1, '');
    }

    public static extractAchievement(response: Response): Achievement {
        let body = response.json();
        return Achievement.parseJSON(body);
    }

    public static extractPaginatedArrayData(res: Response): Achievement[] {
        let body = res.json();
        let achievements: Achievement[] = [];

        if (body.items === undefined) {
            return achievements;
        }

        for (let achievement of body.items) {
            achievements.push(this.parseJSON(achievement));
        }

        return achievements || [];
    }

    static parseJSON(obj: any): Achievement {
        let achievement = Achievement.emptyAchievement();
        achievement.id = obj.id;
        achievement.title = obj.title;
        achievement.description = obj.description;
        achievement.points = obj.points;
        achievement.type = obj.type;
        achievement.status = obj.status;
        achievement.image = obj.image;
        achievement.timestamp = obj.timestamp;
        return achievement;
    }

    public static achievementAlphaCompare(a: Achievement, b: Achievement): number {
        return a.title.localeCompare(b.title);
    }
}
