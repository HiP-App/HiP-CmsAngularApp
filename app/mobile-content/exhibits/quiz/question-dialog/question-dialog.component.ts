import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Question } from '../../shared/question.model';
import { Status } from '../../../shared/status.model';
import { UploadMediumDialogComponent } from '../../../media/upload-medium-dialog/upload-medium-dialog.component';
import { MediaService } from '../../../media/shared/media.service';
import { SelectMediumDialogComponent } from '../../../media/select-medium-dialog/select-medium-dialog.component';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { Medium } from '../../../media/shared/medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-question-dialog',
  styleUrls: ['question-dialog.component.css'],
  templateUrl: 'question-dialog.component.html'
})
export class QuestionDialogComponent implements OnInit {

  question: Question = Question.emptyQuestion();
  statusOptions = Status.getValues();
  isEdit = false;

  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  private imageName: string;
  previewURL: SafeUrl;

  constructor(
    private dialog: MdDialog,
    public dialogRef: MdDialogRef<QuestionDialogComponent>,
    private mediaService: MediaService,
    private domSanitizer: DomSanitizer,
    private toasterService: ToasterService,
    private translateService: TranslateService,
    @Inject(MD_DIALOG_DATA) public data: Question
  ) { }

  ngOnInit() {
    if (this.data != null) {
      this.question = this.data;
      this.isEdit = true;
      this.getMediaName();
    }
  }

  isQuestionValid() {
    return this.question.text.trim().length > 0 && this.question.options[0].trim().length > 0
      && this.question.options[1].trim().length > 0 && this.question.options[2].trim().length > 0
      && this.question.options[3].trim().length > 0;
  }

  addMedia() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, { width: '35em' });
    this.uploadDialogRef.afterClosed().subscribe(
      (obj: any) => {
        if (!obj) { return; }

        let newMedium = obj.media;
        let file: File = obj.file;
        if (!newMedium) { return; }

        this.mediaService.postMedia(newMedium)
          .then(
            (res: any) => {
              if (file) {
                return this.mediaService.uploadFile(res, file);
              }
            }
          ).then(
            () => this.toasterService.pop('success', this.translate('media saved'))
          ).catch(
            err => this.toasterService.pop('error', this.translate('Error while saving'), err)
          );
      }
    );
  }

  selectImage() {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: 'Image' } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          this.question.image = selectedMedium.id;
          this.imageName = selectedMedium.title;
          this.previewImage(this.question.image);
        }
      }
    );
  }

  removeImage() {
    this.question.image = null;
    this.previewURL = null;
    this.getMediaName();
  }

  previewImage(id: number) {
    this.mediaService.downloadFile(id, true)
      .then(
        response => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            base64Data = reader.result;
            this.previewURL = this.domSanitizer.bypassSecurityTrustUrl(base64Data);
          };
        }
      );
  }

  getMediaName() {
    if (!this.question.image) {
      this.imageName = this.translate('no image selected');
    } else {
      this.mediaService.getMediaById(this.question.image)
        .then(
          response => {
            this.imageName = response.title;
            this.previewImage(response.id);
          }
        ).catch(
          error => this.toasterService.pop('error', this.translate('Error fetching image'), error)
        );

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
