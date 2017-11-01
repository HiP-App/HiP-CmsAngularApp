import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA  } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-history-changes-dialog',
  templateUrl: 'change-history.component.html',
  styleUrls: ['change-history.component.css']
})
export class ChangeHistoryComponent {
  constructor(@Inject(MD_DIALOG_DATA) public data,
    public dialogRef: MdDialogRef<ChangeHistoryComponent>) {
    console.log(this.data);
  }
}
