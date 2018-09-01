import { Response } from '@angular/http';

import { statusType } from '../../shared/status.model';

export class ReviewComment {
    constructor(
        // public id: number,
        public reviewId: number,
        public text: string,
        public approved: boolean,
        public userId?: string,
        public status: statusType = 'DRAFT',
        public timestamp?: string
    ) { }

    public static emptyReviewComment(): ReviewComment {
        return new ReviewComment(-1, '', false);
    }

    public static extractReviewComments(res: Response): ReviewComment[] {
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
        // id, description, reviewers, studentsToApprove, reviewableByStudents
        let comment = ReviewComment.emptyReviewComment();
        // comment.id = obj.id;
        comment.text = obj.description;
        comment.approved = obj.approved;
        comment.userId = obj.userId;
        comment.timestamp = obj.timestamp;
        return comment;
    }
}
