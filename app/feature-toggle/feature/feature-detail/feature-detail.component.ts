import { Component } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';

import { Feature } from '../../feature-toggle.model'
import { FeatureToggleService } from '../../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature',
  templateUrl: 'feature-detail.component.html'
})
export class FeatureDetailDialogComponent {

  private feature: Feature = Feature.emptyFeature();
  action:string;
  name:string;
  id:number;

  constructor(public dialogRef: MdDialogRef<FeatureDetailDialogComponent>) {
  }

}