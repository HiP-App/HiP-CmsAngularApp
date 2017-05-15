import { Component, OnInit, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { FeatureGroup } from '../../feature-toggle.model';
import { Feature } from '../../feature-toggle.model';
import { FeatureToggleService } from '../../feature-toggle.service';

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature-group',
  templateUrl: 'create-feature-group-dialog.component.html'
})
export class CreateFeatureGroupDialogComponent implements OnInit {
  private feature: Feature[] = [];
  featureGroup: FeatureGroup = FeatureGroup.emptyFeatureGroup();
  selectedFeature = 1;

  constructor(public dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService) {
  }

  ngOnInit() {
    this.featureToggleService.getAllFeatures()
      .then(
        (response: any) => {
          this.feature = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch features'));
      }
    );
  }

  createNewFeatureGroup() {
    this.featureToggleService.createFeatureGroup(this.featureGroup)
      .then(
        (response: any) => this.handleResponse(response)
      ).catch(
      (error: any) => this.handleError(error)
    );
  }

  private handleResponse(msg: string) {
    this.toasterService.pop('success', 'Success', this.getTranslatedString(msg));
  }

  private handleError(error: any) {
    this.toasterService.pop('error', this.getTranslatedString(error));
  }

  getTranslatedString(data: any) {
    let translatedResponse = '';
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
