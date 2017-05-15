import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Feature } from '../../feature-toggle.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature',
  templateUrl: 'create-feature-dialog.component.html'
})
export class CreateFeatureDialogComponent {

  private feature: Feature = Feature.emptyFeature();
  action: string;
  name: string;
  id: number;

  constructor(public dialogRef: MdDialogRef<CreateFeatureDialogComponent>) {
  }
}
