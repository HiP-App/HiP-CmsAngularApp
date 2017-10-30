import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-history-changes-dialog',
  templateUrl: 'change-history.component.html'
})
export class ChangeHistoryComponent {
  constructor(public dialogRef: MdDialogRef<ChangeHistoryComponent>) {}
}
