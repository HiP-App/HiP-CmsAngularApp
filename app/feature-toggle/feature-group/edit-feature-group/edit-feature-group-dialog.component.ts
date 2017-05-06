import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { FeatureGroup } from '../../feature-toggle.model'
import { Feature } from '../../feature-toggle.model'
@Component({
  moduleId: module.id,
  selector: 'hip-edit-feature-group',
  templateUrl: 'edit-feature-group-dialog.component.html'
})
export class EditFeatureGroupDialogComponent{

  public name:string;
  private featuregroup: FeatureGroup = FeatureGroup.emptyFeatureGroup();

  constructor(public dialogRef: MdDialogRef<EditFeatureGroupDialogComponent>) {
  }

}