import { Component, OnInit } from '@angular/core';
import { MdDialog,MdCheckboxChange } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from '../feature-group/create-feature-group/create-feature-group.component';
import { FeatureGroup } from '../feature-toggle.model'

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html'
})
export class FeatureGroupComponent {
  private featureGroup: FeatureGroup[] = [];
  private dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    console.log(this.featureGroup);
  }
  createFeatureGroup() {
    this.dialogRef = this.dialog.open(CreateFeatureGroupDialogComponent, { height: '25em', width: '45em' });
  }
}