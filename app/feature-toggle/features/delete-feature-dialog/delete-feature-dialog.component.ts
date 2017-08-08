import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-feature',
  templateUrl: 'delete-feature-dialog.component.html'
})
export class DeleteFeatureDialogComponent {
  featureName: string;

  constructor(public dialogRef: MdDialogRef<DeleteFeatureDialogComponent>) {}
}
