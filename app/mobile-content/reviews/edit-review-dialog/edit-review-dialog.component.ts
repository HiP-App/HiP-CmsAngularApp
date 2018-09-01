import { Component, OnInit, Inject } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { TranslateService } from 'ng2-translate';

import { SelectMediumDialogComponent } from './../../media/select-medium-dialog/select-medium-dialog.component';
import { UploadMediumDialogComponent } from './../../media/upload-medium-dialog/upload-medium-dialog.component';
import { Review } from './../shared/reviews.model';
import { Status } from '../../shared/status.model';

@Component({
    moduleId: module.id,
    selector: 'hip-edit-review-dialog',
    templateUrl: 'edit-review-dialog.html',
    styleUrls: ['edit-review-dialog.css']
})
export class EditReviewDialogComponent {

    review: Review = Review.emptyReview();
    statusOptions = Status.getValues();
    isEdit = false;

    private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;
    private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

    private imageName: string;
    previewURL: SafeUrl;

    constructor(
        private dialog: MdDialog,
        private toasterService: ToasterService,
        public dialogRef: MdDialogRef<EditReviewDialogComponent>,
        private domSanitizer: DomSanitizer,
        private translateService: TranslateService,
        @Inject(MD_DIALOG_DATA) public data: Review
    ) { }

    ngOnInit() {
        if (this.data != null) {
          this.review = this.data;
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
