import { Component,OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { MdDialog,MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { FeatureGroup } from '../../feature-toggle.model'
import { Feature } from '../../feature-toggle.model'
import { FeatureToggleService } from '../../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-create-feature-group',
  templateUrl: 'create-feature-group.component.html'
})
export class CreateFeatureGroupDialogComponent{
  private feature: Feature[] = [];
  featureGroup : FeatureGroup = FeatureGroup.emptyFeatureGroup();
  translatedResponse: any;
  selectedFeature = 1;
  @Output() fieldChange: EventEmitter<string>;

 constructor(public dialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService) {
    this.fieldChange = new EventEmitter<string>();
  }

  ngOnInit() {
    this.featureToggleService.getAllFeatures()
      .then(
        (response: any) => {
          this.feature = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your features'));
      }
    );
  }

  createNewFeatureGroup(){
    this.featureToggleService.createFeatureGroup(this.featureGroup)
      .then(
        (response: any) => this.handleResponse(response)
      ).catch(
      (error: any) => this.handleError(error)
    );
  }

  modelChanged(detail: any) {
    this.fieldChange.emit(detail);
  }

  private handleResponse(msg: string) {
    this.toasterService.pop('success', 'Success', this.getTranslatedString(msg));
  }

  private handleError(error: any) {
    this.toasterService.pop('error', this.getTranslatedString(error));
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}