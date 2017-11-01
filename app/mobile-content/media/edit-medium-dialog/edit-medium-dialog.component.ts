import {Component, Inject, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialog,MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';
import { MediaService } from '../shared/media.service';
import { Medium } from '../shared/medium.model';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-medium-dialog',
  styleUrls: ['edit-medium-dialog.component.css'],
  templateUrl: 'edit-medium-dialog.component.html'
})
export class EditMediumDialogComponent implements OnInit, AfterViewInit {
  acceptedTypes = '';
  medium: Medium;
  statusOptions = Status.getValues();
  types = Medium.types;
  file: File;
  previewURL: SafeUrl;
  private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;


  @ViewChild('autosize') autosize: any ;

  constructor(public dialogRef: MdDialogRef<EditMediumDialogComponent>,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private dialog: MdDialog,
              @Inject(MD_DIALOG_DATA) public data: { medium: Medium }) {
  }

  ngOnInit() {
    // deep clone input medium object to make editing cancelable
    this.medium = Medium.parseObject(JSON.parse(JSON.stringify(this.data.medium)));

     // preview image
    this.mediaService.downloadFile(this.medium.id, true)
      .then(
        response => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            base64Data = reader.result;
            this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          };
        }
      ).catch(
        error => this.toasterService.pop('error', this.translate('Error fetching media'), error)
      );
  }

  ngAfterViewInit() {
    let context = this;
    setTimeout(function() { context.autosize.resizeToFitContent(); }, 250);
  }

  public fileSet(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewURL = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private setAcceptedTypes() {
    if (this.medium.isAudio()) {
      this.acceptedTypes = '.mp3';
    } else if (this.medium.isImage()) {
      this.acceptedTypes = '.jpg,.jpeg,.png';
    } else {
      this.acceptedTypes = '';
    }
  }

  private getMediaFile(medium: Medium) {
    this.mediaService.downloadFile(medium.id, false)
      .then(
        () => this.toasterService.pop('success', this.translate('Media file downloaded successfully'))
      ).catch(
        error => this.toasterService.pop('error', this.translate('Error fetching media'), error)
      );
  }

  openHistory() {
    let context = this;
    this.mediaService.getHistory(this.medium.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, { width:'60%',
            data:{
              title: context.medium.title,
              data: response
            }
          });
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.translate('Error fetching history') , error);
      }
    );
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      value => translatedResponse = value as string
    );
    return translatedResponse;
  }
}
