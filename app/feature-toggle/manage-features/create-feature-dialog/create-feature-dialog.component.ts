import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Feature } from '../shared/feature.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature',
  templateUrl: 'create-feature-dialog.component.html'
})
export class CreateFeatureDialogComponent {
  private feature: Feature = Feature.emptyFeature();

  constructor(public dialogRef: MdDialogRef<CreateFeatureDialogComponent>) {}
}
