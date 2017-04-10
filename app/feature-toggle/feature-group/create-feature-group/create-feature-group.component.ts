import { Component } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature-group',
  templateUrl: 'create-feature-group.component.html'
})
export class CreateFeatureGroupDialogComponent {

  constructor(public dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>) {}
}