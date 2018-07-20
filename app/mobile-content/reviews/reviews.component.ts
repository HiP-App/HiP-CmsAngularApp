import { ConfirmDeleteDialogComponent } from './../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { User } from './../../users/user.model';
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

    previewURL: SafeUrl;
    previewedImage: any;

    reviewableUserFlag = false;
    reviewerFlag = false;
    reviewCreatorFlag = false;
    currentUserCanAdmin = false;
    currentUserId: string;
    reviewersIds: string[];

    userId: string;
    fullName: string;

    @Input() exhibitId: number;
    review: Review;
    private addReviewDialogRef: MdDialogRef<AddReviewDialogComponent>;
    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

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
        private reviewService: ReviewService,
        private sanitizer: DomSanitizer
    ) { }

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
                this.userId = this.review.userId; // Review creater's userId
                this.reviewersIds = this.review.reviewers;
                console.log('reviewers ids', this.reviewersIds);
                this.getReviewerImage();
                this.getReviewerName();
                this.checkCurrentUser();
            }
        ).catch(
            error => this.toasterService.pop('error', this.translate('error getting reviews'), error)
        );
    }

    // Checks the rights of current user.
    private checkCurrentUser() {
        this.userService.getCurrent().then(
            returnedUser => {
                this.currentUserId = returnedUser.id;
                // Checks if the current user is in the list of reviewers for the giver givew.
                for (let i = 0; i <= 4; i++) {
                    if (this.currentUserId === this.reviewersIds[i]) {
                        this.reviewableUserFlag = true;
                    }
                }
                // Checks if the review creator is the current user
                if (this.currentUserId === this.userId) {
                    this.reviewCreatorFlag = true;
                }
                // If the current user is admin then sets the flag to true
                if (this.currentUserId === 'auth0|5968ed8cdd1b3733ca94865d') {
                    this.currentUserCanAdmin = true;
                }
            }
        );
    }

    private getId() {
        this.route.params
            .subscribe(params => {
                this.id = +params['id'];
                this.getExhibit();
            });
    }

    // Gets the image of the user who posted the review
    private getReviewerImage() {
        this.userService.getPicture(this.userId)
            .then(
                (response: any) => {
                    let base64Data: string;
                    let reader = new FileReader();
                    reader.readAsDataURL(response);
                    reader.onloadend = () => {
                        base64Data = reader.result;
                        this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
                        this.previewedImage = this.previewURL;
                    };
                }
            ).catch(
                (error: any) => console.error(error)
            );
    }

    private getReviewerName() {
        this.userService.getUserById(this.userId)
            .then(
                returnedUser => {
                    this.fullName = returnedUser.fullName;
                    // this.fullName = response.fullName;
                    console.log('First name', this.fullName);
                }
            ).catch(
                (error: any) => console.log('Error' + error)
            );
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
                        error => this.toasterService.pop('error', this.translate('error adding review'), error)
                    );
            }
        );
    }

    onDeleteReviewClicked(review: Review) {
        this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
            data: {
                title: this.translateService.instant('delete review'),
                message: this.translateService.instant('confirm delete review', { name: review.description })
            }
        });
        this.deleteDialogRef.afterClosed().subscribe(
            (confirmed: boolean) => {
                if (confirmed) {
                    this.reviewService.deleteReview(review)
                        .then(() => {
                            this.toasterService.pop('success', this.translate('success deleting review'));
                            this.getReviews();
                        })
                        .catch(
                            error => this.toasterService.pop('error', this.translate('error deleting review'), error)
                        );
                }
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
