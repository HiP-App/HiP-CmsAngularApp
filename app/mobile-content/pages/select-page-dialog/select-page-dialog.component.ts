import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { MobilePage } from '../shared/mobile-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-select-page-dialog',
  templateUrl: 'select-page-dialog.component.html'
})
export class SelectPageDialogComponent {

  constructor(public dialogRef: MdDialogRef<SelectPageDialogComponent>) {}

  selectPage(page: MobilePage) {
    this.dialogRef.close(page);
  }
}
