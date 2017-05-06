import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-feature-group-dialog',
  templateUrl: 'delete-feature-group-dialog.component.html'
})
export class DeleteFeatureGroupDialogComponent {
  FeatureGroupName: string;

  constructor(public dialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>) {}
}
