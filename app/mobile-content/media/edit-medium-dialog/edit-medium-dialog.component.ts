import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { MediaService } from '../shared/media.service';
import { Medium } from '../shared/medium.model';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-medium-dialog',
  styleUrls: ['edit-medium-dialog.component.css'],
  templateUrl: 'edit-medium-dialog.component.html'
})
export class EditMediumDialogComponent implements OnInit {
  acceptedTypes = '';
  medium: Medium;
  statusOptions = Status.getValues();
  types = Medium.types;
  file: File;
  url: SafeUrl;

  constructor(public dialogRef: MdDialogRef<EditMediumDialogComponent>,
              private service: MediaService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: { medium: Medium }) {
  }

  ngOnInit() {
    // deep clone input medium object to make editing cancelable
    this.medium = JSON.parse(JSON.stringify(this.data.medium));

     // preview image
    this.service.downloadFile(this.medium.id, true)
      .then(
        (response: any) => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);

          reader.onloadend = function () {
            base64Data = reader.result;
          };
          setTimeout(() => {
            this.url = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          }, 10);
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching media'), error)
    );
  }

  public fileSet(event: any) {
    this.file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.url = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private setAcceptedTypes() {
    switch (this.medium.type) {
      case 'Audio':
        this.acceptedTypes = '.mp3';
        break;

      case 'Image':
        this.acceptedTypes = '.jpg,.jpeg,.png';
        break;

      default:
        this.acceptedTypes = '';
    }
  }

  private getMediaFile(medium: Medium) {
    this.service.downloadFile(medium.id, false)
      .then(
        (response: any) => {
          this.toasterService.pop('success', this.translate('Media file downloaded successfully'));
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching media'), error)
    );
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: any) => {
        translatedResponse = value as string;
      }
    );
    return translatedResponse;
  }

}
