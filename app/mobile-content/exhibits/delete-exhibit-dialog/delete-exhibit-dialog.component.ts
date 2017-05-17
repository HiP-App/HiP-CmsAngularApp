import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-exhibit-dialog',
  templateUrl: 'delete-exhibit-dialog.component.html'
})
export class DeleteExhibitDialogComponent {
  exhibitName: string;

  constructor(public dialogRef: MdDialogRef<DeleteExhibitDialogComponent>) { }
}
