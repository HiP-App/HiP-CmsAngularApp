import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-tag-dialog',
  templateUrl: 'delete-tag-dialog.component.html'
})
export class DeleteTagDialogComponent {
  tagName: string;

  constructor(public dialogRef: MdDialogRef<DeleteTagDialogComponent>) {}
}
