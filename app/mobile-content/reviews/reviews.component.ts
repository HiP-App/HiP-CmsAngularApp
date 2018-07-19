import { Tag } from './../../tag-management/tag.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './../../users/user.service';
import { MediaService } from './../media/shared/media.service';
import { MobilePageService } from './../pages/shared/mobile-page.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Exhibit } from './../exhibits/shared/exhibit.model';
import { ExhibitService } from './../exhibits/shared/exhibit.service';
import { Review } from './shared/reviews.model';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';
import { AddReviewDialogComponent } from './add-review-dialog/add-review-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReviewService } from './../exhibits/shared/review.service';

@Component({
    moduleId: module.id,
    selector: 'hip-reviews',
    templateUrl: 'reviews.component.html',
    styleUrls: ['reviews.component.css']
})
export class ReviewsComponent implements OnInit {

    id: number;
    exhibit: Exhibit;
    tags: Tag[] = [];
    rating: any;

    canDelete = true;
    canEdit = true;

    @Input() exhibitId: number;
    review: Review;
    private addReviewDialogRef: MdDialogRef<AddReviewDialogComponent>;

    constructor(
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private mobilePageService: MobilePageService,
        private mediaService: MediaService,
        private router: Router,
        private userService: UserService,
        private spinnerService: NgxSpinnerService,
        private dialog: MdDialog,
        private toasterService: ToasterService,
        private exhibitService: ExhibitService,
        private translateService: TranslateService,
        private reviewService: ReviewService
    ) {}

    ngOnInit() {
        // this.spinnerService.show();
        this.getReviews();
        this.getId();
    }

    private getReviews() {
        this.reviewService.getReviews(this.exhibitId).then(
            returnedReview => {
                this.review = returnedReview;
                console.log("Reviews", this.review);
                // this.reviews = this.reviews.slice();
            }
        ).catch(
            error => this.toasterService.pop('error', this.translate('error getting reviews'), error)
        );
    }

    private getId() {
        this.route.params
            .subscribe(params => {
                this.id = +params['id'];
                this.getExhibit();
            });
    }

    private getExhibit() {
        this.exhibitService
            .getExhibit(this.id)
            .then((exhibit: Exhibit) => {
                this.spinnerService.hide();
                this.exhibit = exhibit;
                this.getCurrentUser();
            })
            .catch((error: any) => {
                this.toasterService.pop('error', this.translate('Error fetching exhibit'), error);
                this.spinnerService.hide();
            });
    }

    // implimented this method so that student can only edit or delete his exhibit only.

    getCurrentUser() {
        this.userService.getCurrent()
            .then(
                (response) => {
                    let currentUserId = response.id;
                    for (let role of response.roles) {
                        if (role === 'Student') {
                            if (currentUserId !== this.exhibit.userId) {
                                this.canDelete = false;
                                this.canEdit = false;
                            } else {
                                this.canDelete = true;
                                this.canEdit = true;
                            }
                        }
                    }

                }
            );
    }

    onAddReviewClicked() {
        this.addReviewDialogRef = this.dialog.open(AddReviewDialogComponent, { width: '450px', height: '720px' });
        this.addReviewDialogRef.afterClosed().subscribe(
            (newReview: Review) => {
                this.reviewService.createReview(this.exhibitId, newReview)
                    .then(() => {
                        this.toasterService.pop('success', this.translate('success adding review'));
                        this.getReviews();
                    })
                    .catch(
                        error => this.toasterService.pop('error', this.translate('error adding question'), error)
                    );
            }
        );
    }



    private translate(data: string): string {
        let translatedResponse: string;
        this.translateService.get(data).subscribe(
            (value: string) => {
                translatedResponse = value;
            }
        );
        return translatedResponse;
    }
}
