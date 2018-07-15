import { Question } from './../../exhibits/shared/question.model';
import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class Review {
    constructor(
        public id: number,
        public exhibitId: number,
        public text: string,
        public options: string[],
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyReview(): Question {
        return new Review(-1, -1, '', ['', '', '', '']);
    }

    public static extractReviews(res: Response): Review[] {
        let body = res.json();
        let reviews: Review[] = [];

        if (body === undefined) {
            return reviews;
        }

        for (let question of body) {
            reviews.push(this.parseJSON(question));
        }
        return reviews;
    }

    static parseJSON(obj: any): Review {
        let review = Review.emptyReview();
        review.id = obj.id;
        review.exhibitId = obj.exhibitId;
        review.text = obj.text;
        review.image = obj.image;
        review.status = obj.status;
        review.timestamp = obj.timestamp;
        for (let i = 0; i < 4; i++) {
            review.options[i] = obj.options[i];
        }
        return review;
    }
}
