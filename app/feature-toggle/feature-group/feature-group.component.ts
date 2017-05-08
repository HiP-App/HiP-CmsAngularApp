import { Component, OnInit, Input  } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from '../feature-group/create-feature-group/create-feature-group.component';
import { DeleteFeatureGroupDialogComponent } from '../feature-group/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { FeatureGroup } from '../feature-toggle.model';
import { FeatureToggleService } from '../feature-toggle.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html'
})
export class FeatureGroupComponent implements OnInit {
  private featureGroups: FeatureGroup;
  private featureGroup: FeatureGroup;
  private createDialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>;
  private isEditEnable = false;
  private editableFeatureGeoupId: number;

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService) {
  }

  ngOnInit() {
    this.getFeatureGroup();
  }

  getFeatureGroup() {
    this.featureToggleService.getAllFeatureGroups()
      .then(
        (response: any) => {
          this.featureGroups = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your feature groups'));
      }
    );
  }

  updateFeatureGroup(updatedFeatureGroup: FeatureGroup) {
    this.isEditEnable = false;
    this.featureToggleService.putFeatureGroup(updatedFeatureGroup)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString('Feature group has been updated'))
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    this.getFeatureGroup();
  }

  editFeatureGroup(id: number) {
    this.featureToggleService.getFeatureGroup(id)
      .then(
        (response: any) => {
          this.featureGroup.name = response.name;
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    this.isEditEnable = true;
    this.editableFeatureGeoupId = id;
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
              (response: any) => this.toasterService.pop('success', this.getTranslatedString('feature group deleted'))
            ).catch(
            (error: any) => this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error)
          );
        }
        this.deleteDialogRef = null;
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

