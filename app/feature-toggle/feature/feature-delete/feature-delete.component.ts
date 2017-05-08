import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-feature',
  templateUrl: 'feature-delete.component.html'
})
export class FeatureDeleteDialogComponent {

  featureName: string;

  constructor(public dialogRef: MdDialogRef<FeatureDeleteDialogComponent>) {
  }
}
