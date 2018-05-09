import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA  } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-history-changes-detailed-dialog',
  templateUrl: 'change-history-detailed.component.html',
  styleUrls: ['change-history-detailed.component.css']
})
export class ChangeHistoryDetailedComponent {
  constructor(@Inject(MD_DIALOG_DATA) public data) {
  }
}
