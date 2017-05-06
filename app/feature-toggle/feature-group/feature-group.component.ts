import { Component, OnInit, Input  } from '@angular/core';
import { MdDialog,MdCheckboxChange } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from '../feature-group/create-feature-group/create-feature-group.component';
import { DeleteFeatureGroupDialogComponent } from '../feature-group/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { EditFeatureGroupDialogComponent } from '../feature-group/edit-feature-group/edit-feature-group-dialog.component';
import { FeatureGroup } from '../feature-toggle.model'
import { FeatureToggleService } from '../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html'
})
export class FeatureGroupComponent {
  private featureGroups: FeatureGroup;
  private featureGroup : FeatureGroup;
  private createDialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>;
  private editdialogRef: MdDialogRef<EditFeatureGroupDialogComponent>;
  private translatedResponse: string;
  private isEditEnable: boolean = false;
  private editableFeatureGeoupId : number;

  constructor(private dialog: MdDialog,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureToggleService: FeatureToggleService) {
  }

  ngOnInit() {
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

  updateFeatureGroup(updatedFeatureGroup : FeatureGroup){
    this.isEditEnable = false;
    this.featureToggleService.putFeatureGroup(updatedFeatureGroup)
      .then(
        (response: any) => this.toasterService.pop('success', this.getTranslatedString('Feature group has been updated'))
      ).catch(
      error => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
  }

  editFeatureGroupDialogue(id:number){
    this.featureToggleService.getFeatureGroup(id)
      .then(
        (response: any) => {
          this.featureGroup.name = response.name;
          debugger;
          //this.featureGroup = response;
        }
      ).catch(
      error => this.toasterService.pop('error', this.getTranslatedString('Error'), error)
    );
    this.isEditEnable = true;
    this.editableFeatureGeoupId = id;
    //this.editdialogRef = this.dialog.open(EditFeatureGroupDialogComponent, {height: '25em', width: '45em'});
  }

  createFeatureGroupDialogue() {
    this.createDialogRef = this.dialog.open(CreateFeatureGroupDialogComponent, {height: '25em', width: '45em'});
    this.createDialogRef.afterClosed().subscribe(
      (newFeatureGroup: FeatureGroup) => {
        if (newFeatureGroup) {
          this.featureToggleService.createFeatureGroup(newFeatureGroup)
            .then(
            response => this.toasterService.pop('success', newFeatureGroup.name + ' ' + this.getTranslatedString('New feature group has been added'))
          ).catch(
            error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  deleteFeatureGroupDialogue(id : number){
     this.deleteDialogRef = this.dialog.open(DeleteFeatureGroupDialogComponent, {height: '14.5em'});
     this.deleteDialogRef.afterClosed().subscribe(
        (deleteConfirmed: boolean) => {
          if (deleteConfirmed) {
            this.featureToggleService.deleteFeatureGroup(id)
              .then(
                response => this.toasterService.pop('success', this.getTranslatedString('feature group deleted'))
              ).catch(
              error => this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error)
            );
          }
          this.deleteDialogRef = null;
        }
      );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}

