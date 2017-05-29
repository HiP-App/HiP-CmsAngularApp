import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdCheckboxChange } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './features/create-feature-dialog/create-feature-dialog.component';
import { CreateFeatureGroupDialogComponent } from './feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureDialogComponent } from './features/delete-feature-dialog/delete-feature-dialog.component';
import { DeleteFeatureGroupDialogComponent } from './feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { Feature } from './features/shared/feature.model';
import { FeatureGroup } from './feature-groups/shared/feature-group.model';
import { FeatureGroupService } from './feature-groups/shared/feature-group.service';
import { FeatureService } from './features/shared/feature.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature-toggle',
  templateUrl: 'feature-toggle.component.html',
  styleUrls: ['feature-toggle.component.css']
})
export class FeatureToggleComponent implements OnInit {
  private featureGroups: FeatureGroup[];
  private features: Feature[];

  // dialogs
  private createFeatureDialogRef: MdDialogRef<CreateFeatureDialogComponent>;
  private createFeatureGroupDialogDef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private deleteFeatureDialogRef: MdDialogRef<DeleteFeatureDialogComponent>;
  private deleteFeatureGroupDialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>;

  constructor(private dialog: MdDialog,
              private featureGroupService: FeatureGroupService,
              private featureService: FeatureService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.features = [new Feature(1, 'Test'), new Feature(2, 'Test 2')]; // TODO remove this line
    this.featureGroups = [new FeatureGroup(5, 'Beta users', ['student3@hipapp.de', 'student3@hipapp.de',
      'student4@hipapp.de', 'student45@hipapp.de', 'testuser@testapp.de'], [1]),
      new FeatureGroup(6, 'Supervisors', [], [2])
    ]; // TODO remove this line
    this.loadFeatures();
    this.loadFeatureGroups();
  }

  private loadFeatureGroups() {
    this.featureGroupService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.featureGroups = response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', 'Error', this.getTranslatedString('not able to fetch feature groups'));
        }
      );
  }

  private loadFeatures() {
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.features = response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', 'Error', this.getTranslatedString('not able to fetch features'));
        }
      );
  }

  createFeatureGroup() {
    this.createFeatureGroupDialogDef = this.dialog.open(CreateFeatureGroupDialogComponent);
    this.createFeatureGroupDialogDef.afterClosed().subscribe(
      (newFeatureGroup: FeatureGroup) => {
        if (newFeatureGroup) {
          this.featureGroups.push(newFeatureGroup); // TODO remove this line
          this.featureGroupService.createFeatureGroup(newFeatureGroup)
            .then(
              () => {
                this.featureGroups.push(newFeatureGroup);
                this.loadFeatureGroups();
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while saving'), error)
            );
        }
      }
    );
  }

  editFeatureGroup(featureGroup: FeatureGroup) {
    this.featureGroupService.updateFeatureGroup(featureGroup)
      .then(
        () => {
          this.loadFeatureGroups();
          this.toasterService.pop('success', this.getTranslatedString('updated feature group'));
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while saving'), error)
    );
  }

  deleteFeatureGroup(featureGroup: FeatureGroup) {
    this.deleteFeatureGroupDialogRef = this.dialog.open(DeleteFeatureGroupDialogComponent, {height: '14.5em'});
    this.deleteFeatureGroupDialogRef.componentInstance.featureGroupName = featureGroup.name;
    this.deleteFeatureGroupDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          let i = this.featureGroups.findIndex(item => item.id === featureGroup.id); // TODO remove this line
          this.featureGroups.splice(i, 1); // TODO remove this line
          this.featureGroupService.deleteFeatureGroup(featureGroup.id)
            .then(
              () => {
                let index = this.featureGroups.findIndex(item => item.id === featureGroup.id);
                this.featureGroups.splice(index, 1);
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while deleting'), error)
            );
        }
      }
    );
  }

  createFeature() {
    this.createFeatureDialogRef = this.dialog.open(CreateFeatureDialogComponent);
    this.createFeatureDialogRef.afterClosed().subscribe(
      (newFeature: Feature) => {
        if (newFeature) {
          this.features.push(newFeature); // TODO remove this line
          this.featureService.createFeature(newFeature)
            .then(
              () => {
                this.features.push(newFeature);
                this.loadFeatures();
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while saving'), error)
            );
        }
        this.createFeatureDialogRef = null;
      }
    );
  }

  updateFeatureToggle(event: MdCheckboxChange, featureId: number, groupId: number) {
    if (event.checked) {
      this.featureService.enableFeatureForGroup(featureId, groupId)
        .then(
          () => {
            // nothing to do
          }
        ).catch(
          (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while deleting'), error)
        );
    } else {
      this.featureService.disableFeatureForGroup(featureId, groupId)
        .then(
          () => {
            // nothing to do
          }
        ).catch(
          (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while deleting'), error)
        );
    }
  }

  deleteFeature(feature: Feature) {
    this.deleteFeatureDialogRef = this.dialog.open(DeleteFeatureDialogComponent);
    this.deleteFeatureDialogRef.componentInstance.featureName = feature.name;
    this.deleteFeatureDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          let i = this.features.findIndex(item => item.id === feature.id); // TODO remove this line
          this.features.splice(i, 1); // TODO remove this line
          this.featureService.deleteFeature(feature.id)
            .then(
              () => {
                let index = this.features.findIndex(item => item.id === feature.id);
                this.features.splice(index, 1);
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.getTranslatedString('error while deleting'), error)
            );
        }
        this.deleteFeatureDialogRef = null;
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
