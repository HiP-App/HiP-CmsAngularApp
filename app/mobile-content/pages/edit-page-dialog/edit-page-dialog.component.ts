import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { MobilePage } from '../shared/mobile-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-page-dialog',
  templateUrl: 'edit-page-dialog.component.html'
})
export class EditPageDialogComponent implements OnInit {
  page: MobilePage;

  constructor(public dialogRef: MdDialogRef<EditPageDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { pageToEdit: MobilePage }) {}

  ngOnInit() {
    if (this.data && this.data.pageToEdit) {
      // deep clone input page to make editing cancelable
      this.page = MobilePage.parseObject(JSON.parse(JSON.stringify(this.data.pageToEdit)));
    } else {
      this.page = new MobilePage();
    }
  }
}
