import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-feature-toggle',
  templateUrl: 'feature-toggle.component.html',
  styleUrls: ['feature-toggle.component.css']
})
export class FeatureToggleComponent implements OnInit, OnDestroy {
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
              private translateService: TranslateService,
              private spinnerService: NgxSpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();
    this.loadFeatures();
    this.loadFeatureGroups();
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  private loadFeatureGroups() {
    this.featureGroupService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.spinnerService.hide();
          this.featureGroups = response;
        }
      ).catch(
        (error: any) => {
          this.spinnerService.hide();
          this.toasterService.pop('error', 'Error', this.translateService.instant('not able to fetch feature groups'));
        }
      );
  }

  private loadFeatures() {
    this.spinnerService.show();
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.spinnerService.hide();
          this.features = response;
        }
      ).catch(
        (error: any) => {
          this.spinnerService.hide();
          this.toasterService.pop('error', 'Error', this.translateService.instant('not able to fetch features'));
        }
      );
  }

  createFeatureGroup() {
    this.createFeatureGroupDialogDef = this.dialog.open(CreateFeatureGroupDialogComponent);
    this.createFeatureGroupDialogDef.afterClosed().subscribe(
      (newFeatureGroup: FeatureGroup) => {
        if (newFeatureGroup) {
          this.featureGroupService.createFeatureGroup(newFeatureGroup)
            .then(
              () => {
                this.featureGroups.push(newFeatureGroup);
                this.toasterService.pop('success', this.translateService.instant('feature group created', {name: newFeatureGroup.name}));
                this.loadFeatureGroups();
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.translateService.instant('error while saving'), error)
            );
        }
      }
    );
  }

  // called when the list of members of a feature group is changed
  onFeatureGroupMembersChange(emails: Array<string>, featureGroupId: Number) {
    let featureGroup = this.featureGroups.find((featureGroup) => {
      return featureGroup.id == featureGroupId;
    });

    if (featureGroup) {
      featureGroup.members = emails;
    }
  }

  editFeatureGroup(featureGroup: FeatureGroup) {
    this.featureGroupService.updateFeatureGroup(featureGroup)
      .then(
        () => {
          this.loadFeatureGroups();
          this.toasterService.pop('success',
            this.translateService.instant('updated members of feature group', { name: featureGroup.name }));
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translateService.instant('error while saving'), error)
      );
  }

  deleteFeatureGroup(featureGroup: FeatureGroup) {
    this.deleteFeatureGroupDialogRef = this.dialog.open(DeleteFeatureGroupDialogComponent, {height: '14.5em'});
    this.deleteFeatureGroupDialogRef.componentInstance.featureGroupName = featureGroup.name;
    this.deleteFeatureGroupDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureGroupService.deleteFeatureGroup(featureGroup.id)
            .then(
              () => {
                let index = this.featureGroups.findIndex(item => item.id === featureGroup.id);
                this.featureGroups.splice(index, 1);
                this.toasterService.pop('success',
                  this.translateService.instant('feature group deleted', {name: featureGroup.name}));
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.translateService.instant('error while deleting'), error)
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
          this.featureService.createFeature(newFeature)
            .then(
              () => {
                this.features.push(newFeature);
                this.toasterService.pop('success', this.translateService.instant('feature created', {name: newFeature.name}));
                this.loadFeatures();
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.translateService.instant('error while saving'), error)
            );
        }
        this.createFeatureDialogRef = null;
      }
    );
  }

  updateFeatureToggle(event: MdCheckboxChange, featureId: number, groupId: number) {
    if (event.checked) {
      this.featureService.enableFeatureForGroup(featureId, groupId)
        .catch(
          (error: any) => this.toasterService.pop('error', this.translateService.instant('error while deleting'), error)
        );
    } else {
      this.featureService.disableFeatureForGroup(featureId, groupId)
        .catch(
          (error: any) => this.toasterService.pop('error', this.translateService.instant('error while deleting'), error)
        );
    }
  }

  deleteFeature(feature: Feature) {
    this.deleteFeatureDialogRef = this.dialog.open(DeleteFeatureDialogComponent);
    this.deleteFeatureDialogRef.componentInstance.featureName = feature.name;
    this.deleteFeatureDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureService.deleteFeature(feature.id)
            .then(
              () => {
                let index = this.features.findIndex(item => item.id === feature.id);
                this.features.splice(index, 1);
                this.toasterService.pop('success',
                  this.translateService.instant('feature deleted', {name: feature.name}));
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.translateService.instant('error while deleting'), error)
            );
        }
        this.deleteFeatureDialogRef = null;
      }
    );
  }
}
