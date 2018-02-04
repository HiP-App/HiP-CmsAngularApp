import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-upload-picture-dialog',
  styleUrls: ['upload-picture-dialog.component.css'],
  templateUrl: 'upload-picture-dialog.component.html'
})
export class UploadPictureDialogComponent implements OnInit {
  files: File[];

  constructor (public dialogRef: MdDialogRef<UploadPictureDialogComponent>,
               private ngZone: NgZone
              ) { }

  ngOnInit() {
    this.files = null;
  }

  chooseImage(files: File[]): void {
    this.files = files;
  }
}
