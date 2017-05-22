import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-medium-dialog',
  templateUrl: 'delete-medium-dialog.component.html'
})
export class DeleteMediumDialogComponent {
  mediumTitle: string;

  constructor(public dialogRef: MdDialogRef<DeleteMediumDialogComponent>) {}
}
