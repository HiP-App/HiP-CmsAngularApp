import { TranslateService } from 'ng2-translate';
import { AddReviewDialogComponent } from './../add-review-dialog/add-review-dialog.component';
import { ToasterService } from 'angular2-toaster';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SelectMediumDialogComponent } from './../../media/select-medium-dialog/select-medium-dialog.component';
import { UploadMediumDialogComponent } from './../../media/upload-medium-dialog/upload-medium-dialog.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ReviewComment } from './../shared/review-comment.model';
import { Component, Inject, OnInit } from '@angular/core';
import { Status } from '../../shared/status.model';

@Component({
    moduleId: module.id,
    selector: 'review-comment',
    templateUrl: 'review-comment.component.html',
    styleUrls: ['review-comment.component.css']
})
export class ReviewCommentComponent implements OnInit {

    comment: ReviewComment = ReviewComment.emptyReview();
    statusOptions = Status.getValues();
    isEdit = false;

    private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

    private imageName: string;
    previewURL: SafeUrl;

    constructor(
        private dialog: MdDialog,
        private toasterService: ToasterService,
        public dialogRef: MdDialogRef<AddReviewDialogComponent>,
        private domSanitizer: DomSanitizer,
        private translateService: TranslateService,
        @Inject(MD_DIALOG_DATA) public data: ReviewComment
    ) { }

    ngOnInit() {
        if (this.data != null) {
          this.comment = this.data;
          this.isEdit = true;
        }
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
