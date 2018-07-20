import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SelectMediumDialogComponent } from './../../media/select-medium-dialog/select-medium-dialog.component';
import { UploadMediumDialogComponent } from './../../media/upload-medium-dialog/upload-medium-dialog.component';
import { Review } from './../shared/reviews.model';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Status } from '../../shared/status.model';

@Component({
    moduleId: module.id,
    selector: 'hip-add-review-dialog',
    templateUrl: 'add-review-dialog.component.html',
    styleUrls: ['add-review-dialog.component.css']
})
export class AddReviewDialogComponent implements OnInit {

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
        public dialogRef: MdDialogRef<AddReviewDialogComponent>,
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
