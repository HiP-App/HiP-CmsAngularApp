import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { MdDialog,MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import {IFeature} from './feature';
import { FeatureDetailDialogComponent } from '../feature/feature-detail/feature-detail.component';
import { FeatureDeleteDialogComponent } from '../feature/feature-delete/feature-delete.component';
import {FeatureService} from './feature.service'

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
  features: IFeature[];

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureService) {}

  ngOnInit(): void {
               this.featureService.getFeatures()
                .subscribe(features => this.features = features,
                           error => this.errorMessage = <any>error);
                }
  createFeature() {
    this.dialogRef = this.dialog.open(FeatureDetailDialogComponent, { height: '20em', width: '45em' });
    this.dialogRef.componentInstance.action = "Create feature";
  }

  editFeature(id:number) {

    var context = this;
    this.featureService.getFeature(id).subscribe(feature => {
      context.dialogRef.componentInstance.name  = feature.name;
      context.dialogRef.componentInstance.id  = feature.id;
      context.dialogRef.componentInstance.description  = feature.description;
    },
               error => this.errorMessage = <any>error);

    this.dialogRef = this.dialog.open(FeatureDetailDialogComponent, { height: '20em', width: '45em' });
    this.dialogRef.componentInstance.action = "Edit feature";
    }


  deleteFeature() {
    this.deleteRef = this.dialog.open(FeatureDeleteDialogComponent,{ height: '10em', width: '25em' });
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
