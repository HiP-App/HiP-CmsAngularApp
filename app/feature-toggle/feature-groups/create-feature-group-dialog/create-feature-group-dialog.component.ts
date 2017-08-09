import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { FeatureGroup } from '../shared/feature-group.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature-group',
  templateUrl: 'create-feature-group-dialog.component.html'
})
export class CreateFeatureGroupDialogComponent {
  featureGroup: FeatureGroup = FeatureGroup.emptyFeatureGroup();

  constructor(public dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>) {}
}
