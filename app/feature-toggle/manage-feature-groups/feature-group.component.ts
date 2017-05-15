import { Component, OnInit, Input  } from '@angular/core';
import { MdDialog, MdCheckboxChange } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from
  '../manage-feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureGroupDialogComponent } from
  '../manage-feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { FeatureGroup, Feature } from '../feature-toggle.model';
import { FeatureToggleService } from '../feature-toggle.service';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user.model';

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html',
  styleUrls: ['feature-group.component.css']
})
export class FeatureGroupComponent implements OnInit {
  private featureGroups: FeatureGroup[];
  private createDialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>;
  private isEditEnable = false;
  private editableFeatureGroupId: number;
  private allEnabledFeatures: any = [];
  private allFeatures: string[] = [];
  public userNames: string[] = [];
  selectedFeatureGroup = '';
  errorMessage: string;
  users: User[];

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getFeatureGroup();
    this.getAllFeatures();
    this.getAllUsers();
  }

  getFeatureGroup() {
    this.featureToggleService.getAllFeatureGroups()
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

  checkEnabledFeatures(subscribedFeatures: any, allFeatures: any) {
    for (let j in subscribedFeatures) {
      if (subscribedFeatures[j] === allFeatures) {
        return true;
      }
    }
  }

  getAllUsers() {
    this.userService.getAll()
      .then(
        (data: any) => this.getNames(<User[]> data)
      ).catch(
      (error: any) => this.errorMessage = <any>error.error
    );
  }

  /**
   * Gets the email for every existing user in the system
   *
   */
  getNames(users: User[]) {
    for (let user of users) {
      this.userNames.push(user.email);
    }
  }

  getAllFeatures() {
    this.featureToggleService.getAllFeatures()
      .then(
        (response: any) => {
          this.allFeatures = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch features'));
      }
    );
  }

  updateFeatureGroup(updatedFeatureGroup: FeatureGroup) {
    this.isEditEnable = false;
    updatedFeatureGroup.enabledFeatures = this.allEnabledFeatures;
    updatedFeatureGroup.members = [this.selectedFeatureGroup];
    this.featureToggleService.putFeatureGroup(updatedFeatureGroup)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString('Feature group has been updated'))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while updating'), error)
    );
    this.allEnabledFeatures = [];
    this.selectedFeatureGroup = '';
    this.getFeatureGroup();
  }

  setUserInFeatureGroup(userEmail: any, featureId: number) {
    this.selectedFeatureGroup = userEmail;
    this.featureToggleService.putUserInFeatureGroup(userEmail, featureId)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString('User has been added in feature group'))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    this.selectedFeatureGroup = '';
  }

  editFeatureGroup(id: number) {
    this.isEditEnable = true;
    this.editableFeatureGroupId = id;
  }

  createFeatureGroupDialogue() {
    this.createDialogRef = this.dialog.open(CreateFeatureGroupDialogComponent, {height: '15em', width: '25em'});
    this.createDialogRef.afterClosed().subscribe(
      (newFeatureGroup: FeatureGroup) => {
        if (newFeatureGroup) {
          this.featureToggleService.createFeatureGroup(newFeatureGroup)
            .then(
              (response: any) => {
                this.toasterService.pop('success', this.getTranslatedString('New feature group has been added'));
              }).catch(
            (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  deleteFeatureGroupDialogue(featureGroup: FeatureGroup) {
    this.deleteDialogRef = this.dialog.open(DeleteFeatureGroupDialogComponent, {height: '14.5em'});
    this.deleteDialogRef.componentInstance.featureGroupName = featureGroup.name;
    this.deleteDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.featureToggleService.deleteFeatureGroup(featureGroup.id)
            .then(
              (response: any) => this.toasterService.pop('success', this.getTranslatedString('Feature group deleted'))
            ).catch(
            (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error)
          );
        }
        this.deleteDialogRef = null;
      }
    );
  }

  updateFeatureSubscription(event: MdCheckboxChange, allEnabledFeatures: any, allFeature: any) {
    if (event.checked) {
      this.allEnabledFeatures.push(allFeature);
    } else {
      for (let m in allEnabledFeatures) {
        if (allEnabledFeatures[m] === allFeature) {
          let index: number = allEnabledFeatures.indexOf(allFeature);
          if (index !== -1) {
            allEnabledFeatures.splice(index, 1);
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

