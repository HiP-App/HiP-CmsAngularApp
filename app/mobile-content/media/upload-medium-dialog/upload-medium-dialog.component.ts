import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Medium } from '../medium.model';

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

  constructor(public dialogRef: MdDialogRef<UploadMediumDialogComponent>) {
    this.setAcceptedTypes();
  }

  setAcceptedTypes() {
    switch (this.medium.type) {
      case 'audio':
        this.acceptedTypes = '.mp3,.m4a';
        break;

      case 'image':
        this.acceptedTypes = '.jpg,.jpeg,.png';
        break;

      default:
        this.acceptedTypes = '';
    }
  }

  public fileSet(event: any ) {
    this.file = event.target.files[0];
  }

}
