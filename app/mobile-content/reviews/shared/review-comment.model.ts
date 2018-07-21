import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class ReviewComment {
    constructor(
        public id: number;
        public entityId: number,
        public entityType: string,
        public text: string,
        public recipient: string,
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyReview(): ReviewComment {
        return new ReviewComment(-1, -1, '', '', '');
    }

    public static extractReviews(res: Response): ReviewComment[] {
        let body = res.json();
        let comments: ReviewComment[] = [];

        if (body === undefined) {
            return comments;
        }

        if (body) {
            comments.push(this.parseJSON(body));
        }
        return comments;
    }

    static parseJSON(obj: any): ReviewComment {
        let comment = ReviewComment.emptyReview();
        // comment.id = obj.id;
        // comment.entityId = obj.entityId;
        // comment.reviewers = obj.reviewers;
        // comment.status = obj.status;
        // comment.userId = obj.userId;
        // comment.timestamp = obj.timestamp;
        return comment;
    }
}
