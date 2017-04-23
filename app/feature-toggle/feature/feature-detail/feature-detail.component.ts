import { Component } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';
import { IFeature } from '../feature';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature',
  templateUrl: 'feature-detail.component.html'
})
export class FeatureDetailDialogComponent {

  action:string;
  name:string;
  id:number;
  description:string;
  constructor(public dialogRef: MdDialogRef<FeatureDetailDialogComponent>) {}


  saveFeature(id:number) {



}
}
