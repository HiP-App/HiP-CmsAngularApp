import { Component, OnInit } from '@angular/core';
import { MdDialog,MdCheckboxChange } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from '../feature-group/create-feature-group/create-feature-group.component';
import { FeatureGroup } from '../feature-toggle.model'
import { FeatureToggleService } from '../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html'
})
export class FeatureGroupComponent {
  private featureGroup: FeatureGroup[];
  private dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService) {
  }

  ngOnInit() {
    this.featureToggleService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.featureGroup = response;
          debugger;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your notifications'));
      }
    );
    console.log(this.featureGroup);
  }

  createFeatureGroup() {
    this.dialogRef = this.dialog.open(CreateFeatureGroupDialogComponent, {height: '25em', width: '45em'});
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}

