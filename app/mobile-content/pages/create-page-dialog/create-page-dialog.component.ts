import { Component, Inject, OnInit, DoCheck } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { MobilePage, pageType } from '../shared/mobile-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-page-dialog',
  templateUrl: 'create-page-dialog.component.html'
})
export class CreatePageDialogComponent implements OnInit, DoCheck {
  page: MobilePage;
  private prevType: pageType;

  constructor(public dialogRef: MdDialogRef<CreatePageDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { pageToEdit: MobilePage }) {}

  ngOnInit() {
    if (this.data && this.data.pageToEdit) {
      // deep clone input page to make editing cancelable
      this.page = MobilePage.parseObject(JSON.parse(JSON.stringify(this.data.pageToEdit)));
    } else {
      this.page = new MobilePage();
      // sets default page type
      this.page.defaultPageType('Image_Page');
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
    let dialogWidth = this.page.isImagePage() ? '80%' : '80%';
    this.dialogRef.updateSize(dialogWidth);
  }
}
