import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdCheckboxChange } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import {Feature, FeatureGroup} from '../feature-toggle.model';
import { CreateFeatureDialogComponent } from '../manage-features/create-feature-dialog/create-feature-dialog.component';
import { DeleteFeatureDialogComponent } from '../manage-features/delete-feature-dialog/delete-feature-dialog.component';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature',
  templateUrl: 'feature.component.html'
})

export class FeatureComponent implements OnInit {
  private dialogRef: MdDialogRef<CreateFeatureDialogComponent>;
  private deleteRef: MdDialogRef<DeleteFeatureDialogComponent>;
  private featureGroups: FeatureGroup[];
  private isEditFeatureEnable = false;
  private editableFeatureID: number;
  private allEnabledGroups: any = [];
  errorMessage: string;
  features: Feature[];

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureToggleService) {
  }


  ngOnInit() {
    this.getFeatures();
    this.getAllFeatureGroup();
  }

  getFeatures() {
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.features = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch features'));
      }
    );
  }

  getAllFeatureGroup() {
    this.featureService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.featureGroups = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch feature groups'));
      }
    );
  }

  checkEnabledFeatureGroups(subscribedFeatureGroups: any, allFeatureGroups: any) {
    for (let j in subscribedFeatureGroups) {
      if (subscribedFeatureGroups[j] === allFeatureGroups) {
        return true;
      }
    }
  }

  createFeature() {
    this.dialogRef = this.dialog.open(CreateFeatureDialogComponent, {height: '15em', width: '25em'});
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
    this.isEditFeatureEnable = true;
    this.editableFeatureID = id;
  }


  deleteFeature(feature: Feature) {
    this.deleteRef = this.dialog.open(DeleteFeatureDialogComponent,  {height: '14.5em'});
    this.deleteRef.componentInstance.featureName = feature.name;
    this.deleteRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureService.deleteFeature(feature.id)
            .then(
              (response: any) => this.toasterService.pop('success', this.getTranslatedString('Feature deleted'))
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
    feature.groupsWhereEnabled = this.allEnabledGroups;
    this.featureService.putFeature(feature)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString(response))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while updating'), error)
    );
    this.allEnabledGroups = [];
    this.getFeatures();
  }

  updateFeatureSubscription(event: MdCheckboxChange, allEnabledGroups: any, allGroups: any) {
    if (event.checked) {
      this.allEnabledGroups.push(allGroups);
    } else {
      for (let z in allEnabledGroups) {
        if (allEnabledGroups[z] === allGroups) {
          let index: number = allEnabledGroups.indexOf(allGroups);
          if (index !== -1) {
            allEnabledGroups.splice(index, 1);
          }
        }
      }
    }
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
