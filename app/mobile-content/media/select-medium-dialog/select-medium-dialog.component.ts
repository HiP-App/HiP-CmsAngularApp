import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Medium } from '../medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-select-medium-dialog',
  styles: ['md-dialog-content { padding-top: 1em; }'],
  templateUrl: 'select-medium-dialog.component.html'
})
export class SelectMediumDialogComponent {
  constructor(public dialogRef: MdDialogRef<SelectMediumDialogComponent>) { }

  selectMedium(medium: Medium) {
    this.dialogRef.close(medium);
  }
}
