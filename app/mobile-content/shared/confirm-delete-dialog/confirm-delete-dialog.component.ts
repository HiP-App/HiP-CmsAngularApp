import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-confirm-delete-dialog',
  templateUrl: 'confirm-delete-dialog.component.html'
})
export class ConfirmDeleteDialogComponent implements OnInit {
  title: string;
  message: string;

  constructor(@Inject(MD_DIALOG_DATA) public data: { title: string, message: string },
              public dialogRef: MdDialogRef<ConfirmDeleteDialogComponent>) {}

  ngOnInit() {
    if (this.data) {
      this.title = this.data.title;
      this.message = this.data.message;
    }
  }
}
