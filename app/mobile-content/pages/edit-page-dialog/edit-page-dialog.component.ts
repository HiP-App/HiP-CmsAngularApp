import { Component, Inject, OnInit, DoCheck } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { MobilePage, pageType } from '../shared/mobile-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-page-dialog',
  templateUrl: 'edit-page-dialog.component.html'
})
export class EditPageDialogComponent implements OnInit, DoCheck {
  page: MobilePage;
  private prevType: pageType;

  constructor(public dialogRef: MdDialogRef<EditPageDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { pageToEdit: MobilePage }) {}

  ngOnInit() {
    if (this.data && this.data.pageToEdit) {
      // deep clone input page to make editing cancelable
      this.page = MobilePage.parseObject(JSON.parse(JSON.stringify(this.data.pageToEdit)));
    } else {
      this.page = new MobilePage();
    }
    this.prevType = this.page.pageType;
    this.adjustDialogWidth();
  }

  ngDoCheck() {
    if (this.prevType !== this.page.pageType) {
      this.adjustDialogWidth();
      this.prevType = this.page.pageType;
    }
  }

  private adjustDialogWidth() {
    let dialogWidth = this.page.isAppetizerPage() ? '45%' : '80%';
    this.dialogRef.updateSize(dialogWidth);
  }
}
