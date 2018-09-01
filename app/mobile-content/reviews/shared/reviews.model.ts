import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Review {
    constructor(
        // public id: number,
        public exhibitId: number,
        public description: string,
        public reviewers?: string[],
        public studentsToApprove = 2,
        public reviewableByStudents?: boolean,
        public userId?: string,
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyReview(): Review {
        return new Review(-1, '', [''], 2, false);
    }

    public static extractReviews(res: Response): Review[] {
        let body = res.json();
        let reviews: Review[] = [];

        if (body === undefined) {
            return reviews;
        }

        if (body) {
            reviews.push(this.parseJSON(body));
        }
        return reviews;
    }

    static parseJSON(obj: any): Review {
        // id, description, reviewers, studentsToApprove, reviewableByStudents
        let review = Review.emptyReview();
        // review.id = obj.id;
        review.exhibitId = 0;
        //review.approved = obj.approved;
        review.description = obj.description;
        review.reviewableByStudents = false;
        review.reviewers = obj.reviewers;
        review.status = obj.status;
        review.userId = obj.userId;
        review.timestamp = obj.timestamp;
        for (let i = 0; i < 1; i++) {
            review.reviewers[0] = obj.reviewers[0];
        }
        return review;
    }
}
