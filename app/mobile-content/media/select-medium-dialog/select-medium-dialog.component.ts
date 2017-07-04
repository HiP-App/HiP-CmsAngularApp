import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Medium, mediaType } from '../shared/medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-select-medium-dialog',
  styles: ['md-dialog-content { padding-top: 1em; }'],
  templateUrl: 'select-medium-dialog.component.html'
})
export class SelectMediumDialogComponent implements OnInit {
  typeFilter: 'ALL' | mediaType;

  constructor(@Inject(MD_DIALOG_DATA) public data: { type: 'ALL' | mediaType },
              public dialogRef: MdDialogRef<SelectMediumDialogComponent>) { }

  ngOnInit() {
    if (this.data && this.data.type && Medium.types.includes(this.data.type)) {
      this.typeFilter = this.data.type;
    } else {
      this.typeFilter = 'ALL';
    }
  }

  selectMedium(medium: Medium) {
    this.dialogRef.close(medium);
  }
}
