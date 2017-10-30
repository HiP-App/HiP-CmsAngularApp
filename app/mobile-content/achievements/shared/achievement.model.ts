import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export abstract class Achievement {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public points: number,
        public type: string,
        public status: statusType = 'DRAFT',
        public thumbnailUrl?: string,
        public timestamp?: string
    ) { }
}
