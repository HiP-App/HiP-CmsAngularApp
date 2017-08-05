import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { MobilePage } from '../shared/mobile-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-select-page-dialog',
  styles: ['md-dialog-content { padding-top: .5em; }'],
  templateUrl: 'select-page-dialog.component.html'
})
export class SelectPageDialogComponent implements OnInit {
  asInfoPage = false;
  excludeIds: number[] = [];

  constructor(public dialogRef: MdDialogRef<SelectPageDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { asInfoPage: boolean, excludeIds: number[] }) {}

  ngOnInit() {
    if (this.data) {
      this.asInfoPage = this.data.asInfoPage;
      this.excludeIds = this.data.excludeIds;
    }
  }

  selectPage(page: MobilePage) {
    this.dialogRef.close(page);
  }
}
