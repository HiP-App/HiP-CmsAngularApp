import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Review {
    constructor(
        public id: number,
        public exhibitId: number,
        public description: string,
        public reviewers: string[],
        public reviewableByStudents: boolean,
        public userId: string,
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyReview(): Review {
        return new Review(-1, -1, '', [''], false, '');
    }

    public static extractReviews(res: Response): Review {
        let body = res.json();
        let review: Review;

        if (body === undefined) {
            return review;
        }

        if (body) {
            review = this.parseJSON(body);
        }
        return review;
    }

    static parseJSON(obj: any): Review {
        // id, description, reviewers, studentsToApprove, reviewableByStudents
        let review = Review.emptyReview();
        review.id = obj.id;
        //review.approved = obj.approved;
        review.description = obj.description;
        review.reviewers = obj.reviewers;
        review.status = obj.status;
        review.userId = obj.userId;
        review.timestamp = obj.timestamp;
        for (let i = 0; i < 4; i++) {
            review.reviewers[i] = obj.reviewers[i];
        }
        return review;
    }
}
