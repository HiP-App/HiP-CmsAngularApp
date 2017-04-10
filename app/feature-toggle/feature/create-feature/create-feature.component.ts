import { Component } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature',
  templateUrl: 'create-feature.component.html'
})
export class CreateFeatureDialogComponent {

  constructor(public dialogRef: MdDialogRef<CreateFeatureDialogComponent>) {}
}