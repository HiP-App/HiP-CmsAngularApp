import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { MdDialog,MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureDialogComponent } from '../feature/create-feature/create-feature.component';
@Component({
  moduleId: module.id,
  selector: 'hip-feature',
  templateUrl: 'feature.component.html'
})
export class FeatureComponent {
  private dialogRef: MdDialogRef<CreateFeatureDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  createFeature() {
    this.dialogRef = this.dialog.open(CreateFeatureDialogComponent, { height: '25em', width: '45em' });

  }
}