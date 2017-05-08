import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Feature } from '../feature-toggle.model';
import { FeatureDetailDialogComponent } from '../feature/feature-detail/feature-detail.component';
import { FeatureDeleteDialogComponent } from '../feature/feature-delete/feature-delete.component';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature',
  templateUrl: 'feature.component.html'
})

export class FeatureComponent implements OnInit {
  private dialogRef: MdDialogRef<FeatureDetailDialogComponent>;
  private deleteRef: MdDialogRef<FeatureDeleteDialogComponent>;
  private isEditFeatureEnable = false;
  private editableFeatureID: number;
  errorMessage: string;
  features: Feature[];

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureToggleService) {
  }


  ngOnInit() {
    this.getFeatures();
  }

  getFeatures() {
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.features = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your features'));
      }
    );
  }

  createFeature() {
    this.dialogRef = this.dialog.open(FeatureDetailDialogComponent, {height: '20em', width: '45em'});
    this.dialogRef.componentInstance.action = 'Create feature';
    this.dialogRef.afterClosed().subscribe(
      (newFeature: Feature) => {
        if (newFeature) {
          this.featureService.createFeature(newFeature)
            .then(
              (response: any) => this.toasterService.pop('success', this.getTranslatedString('New feature has been added'))
            ).catch(
            (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
          );
        }
        this.dialogRef = null;
      }
    );
    this.getFeatures();
  }

  editFeature(id: number) {
   this.featureService.getFeature(id)
      .then(
        (response: any) => this.toasterService.pop('error', this.getTranslatedString('Success'))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    this.isEditFeatureEnable = true;
    this.editableFeatureID = id;
  }


  deleteFeature(feature: Feature) {
    this.deleteRef = this.dialog.open(FeatureDeleteDialogComponent,  {height: '14.5em'});
    this.deleteRef.componentInstance.featureName = feature.name;
    this.deleteRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureService.deleteFeature(feature.id)
            .then(
              (response: any) => this.toasterService.pop('success', this.getTranslatedString('feature deleted'))
            ).catch(
            (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error)
          );
        }
        this.deleteRef = null;
      }
    );
  }

  updateFeature(feature: Feature) {
    this.isEditFeatureEnable = false;
    this.featureService.putFeature(feature)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString(response))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
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
