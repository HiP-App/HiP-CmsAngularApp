import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdCheckboxChange } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AuthServiceComponent } from './../authentication/auth.service';
import { User } from './../users/user.model';
import { UserService } from './../users/user.service';
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
  errorMessage = '';
  private currentUser = User.getEmptyUser();
  loggedIn: boolean;
  showStudentDetails: boolean;

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
              private userService: UserService,
              private authService: AuthServiceComponent) {}

  ngOnInit() {
    this.loadEnabledFeaturesForCurrentUser();
    this.loadFeatures();
    this.loadFeatureGroups();
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent()
      .then(
        (data: any) => {
        this.currentUser = <User> data;
        },
        (error: any) =>
        this.errorMessage = <any> error
      );
  }
}

  private loadFeatureGroups() {
    this.featureGroupService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.featureGroups = response;
          for (let group in response) {
            console.log(this.featureGroups[group].id, this.featureGroups[group].members);
            console.log(this.featureGroups[group].id);
            for(let member in this.featureGroups[group].members) {
              if (this.currentUser.email === this.featureGroups[group].members[member]) {
              console.log(group, 'and', this.featureGroups[group].id);
              }
              else {
                console.log('null');
              }
            }
          }
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', 'Error', this.translateService.instant('not able to fetch feature groups'));
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
          this.toasterService.pop('error', 'Error', this.translateService.instant('not able to fetch features'));
        }
      );
  }

  private loadEnabledFeaturesForCurrentUser() {
    this.featureService.getEnabledFeaturesForCurrentUser()
      .then(
        (response: any) => {
          this.featureService.getEnabledFeaturesForCurrentUser = response;
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
