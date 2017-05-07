import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { MdDialog,MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { FeatureDetailDialogComponent } from '../feature/feature-detail/feature-detail.component';
import { FeatureDeleteDialogComponent } from '../feature/feature-delete/feature-delete.component';
import { Feature } from '../feature-toggle.model'
import { FeatureToggleService } from '../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-feature',
  templateUrl: 'feature.component.html'
})

export class FeatureComponent implements OnInit {
  private dialogRef: MdDialogRef<FeatureDetailDialogComponent>;
  private deleteRef: MdDialogRef<FeatureDeleteDialogComponent>;
  private translatedResponse: string;
  errorMessage: string;
  features: Feature[];

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureToggleService) {}


  ngOnInit() {
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.features = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your feature groups'));
      }
    );
  }
  createFeature() {
    this.dialogRef = this.dialog.open(FeatureDetailDialogComponent, { height: '20em', width: '45em' });
    this.dialogRef.componentInstance.action = "Create feature";
    this.dialogRef.afterClosed().subscribe(
      (newFeature: Feature) => {
        if (newFeature) {
          this.featureService.createFeature(newFeature)
            .then(
              (response:any) => this.toasterService.pop('success', newFeature.name + ' ' + this.getTranslatedString('New feature group has been added'))
            ).catch(
            (error:any) => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
          );
        }
        this.dialogRef = null;
      }
    );
  }

  editFeature(id:number) {
    this.dialogRef = this.dialog.open(FeatureDetailDialogComponent, { height: '20em', width: '45em' });
    this.dialogRef.componentInstance.action = "Edit feature";

    this.featureService.getFeature(id)
      .then(
        (response: Feature) => {
          this.dialogRef.componentInstance.name  = response.name;
          this.dialogRef.componentInstance.id  = response.id;
        }
      ).catch(
      (error:any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    }


  deleteFeature(id:number) {
    this.deleteRef = this.dialog.open(FeatureDeleteDialogComponent,{ height: '10em', width: '25em' });
    this.deleteRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureService.deleteFeature(id)
            .then(
              (response:any) => this.toasterService.pop('success', this.getTranslatedString('feature deleted'))
            ).catch(
            (error:any) => this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error)
          );
        }
        this.deleteRef = null;
      }
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
