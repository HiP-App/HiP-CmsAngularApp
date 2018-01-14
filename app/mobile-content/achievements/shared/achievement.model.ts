import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export abstract class Achievement {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public points: number,
        public type: string,
        // tslint:disable-next-line:no-inferrable-types
        public status: string = 'DRAFT',
        public thumbnailUrl?: string,
        public timestamp?: string
    ) { }

    public isValid(): boolean {
        return this.title && this.title.trim().length > 3;
    }


}
