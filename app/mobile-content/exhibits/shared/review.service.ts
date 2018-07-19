import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { MobileContentApiService } from './../../shared/mobile-content-api.service';
import { Review } from './../../reviews/shared/reviews.model';

@Injectable()
export class ReviewService {

    constructor(private mobileContentApiService: MobileContentApiService) { }

    getReviews(exhibitId: number): Promise<Review> {
        return this.mobileContentApiService.getUrl('/api/Exhibits/Review/' + exhibitId, {})
      .toPromise()
      .then(
        (response: Response) => {
          console.log(Review.extractReviews(response));
          console.log("It worked" + response);
          return Review.extractReviews(response);
        }
      ).catch(
        (error: any) => Review.extractReviews(error)
      );
    }

    /**
     * A post call to add a new review.
     * @param exhibitId Id of the echibit for which review is being created.
     * @param description Description of the review.
     * @param reviewers UserIDs of reviewers, who can approve the review and publish it.
     * @param studentsToApprove Number of students that need to approve, in order to approve the review.
     * @param reviewableByStudents true, if the review is reviewable by students, else false.
     */
    createReview(exhibitId: number, review: Review) {
        return this.mobileContentApiService.putUrl('/api/Exhibits/Pages/Review/' + review.id, JSON.stringify(review.description))
            .toPromise()
            .then(
                (response: Response) => { return response; }
            )
            .catch(
                (error: any) => ReviewService.handleError(error)
            );
    }

    private static handleError(error: any) {
        let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Promise.reject(errMsg);
    }
}
