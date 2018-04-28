import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA  } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-history-changes-dialog',
  templateUrl: 'change-history.component.html',
  styleUrls: ['change-history.component.css']
})
export class ChangeHistoryComponent {
  constructor(@Inject(MD_DIALOG_DATA) public data, public dialogRef: MdDialogRef<ChangeHistoryComponent>) {
  }

  // cast something to string to be displayed. E.g. empty array [] must be displayed as the string "[]"
  castToString(something: any) {
    if(something === undefined) return "//";
    if(typeof something === "object") return JSON.stringify(something);
    return String(something);
  }
}
