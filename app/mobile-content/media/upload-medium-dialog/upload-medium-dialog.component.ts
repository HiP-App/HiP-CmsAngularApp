import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Medium } from '../shared/medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-upload-medium-dialog',
  styleUrls: ['upload-medium-dialog.component.css'],
  templateUrl: 'upload-medium-dialog.component.html'
})
export class UploadMediumDialogComponent {
  acceptedTypes = '';
  medium = new Medium();
  types = Medium.types;
  file: File;
  url: string;

  constructor(public dialogRef: MdDialogRef<UploadMediumDialogComponent>) {
    this.setAcceptedTypes();
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

}
