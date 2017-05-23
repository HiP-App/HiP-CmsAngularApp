import { Component, OnInit  } from '@angular/core';
import { MdDialog } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from './create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureGroupDialogComponent } from './delete-feature-group-dialog/delete-feature-group-dialog.component';
import { FeatureGroup } from './shared/feature-group.model';
import { FeatureGroupService } from './shared/feature-group.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature-group',
  templateUrl: 'feature-group.component.html',
  styleUrls: ['feature-group.component.css']
})
export class FeatureGroupComponent implements OnInit {
  private featureGroups: FeatureGroup[];

  // dialogs
  private createDialogRef: MdDialogRef<CreateFeatureGroupDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteFeatureGroupDialogComponent>;

  constructor(private dialog: MdDialog,
              private featureGroupService: FeatureGroupService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.featureGroups = [new FeatureGroup(5, 'X', ['student3@hipapp.de', 'testuser@testapp.de'], [1]),
      new FeatureGroup(5, 'Y', [], [2])]; // TODO remove this line
    this.loadFeatureGroups();
  }

  loadFeatureGroups() {
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

  createFeatureGroupDialogue() {
    this.createDialogRef = this.dialog.open(CreateFeatureGroupDialogComponent);
    this.createDialogRef.afterClosed().subscribe(
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

  deleteFeatureGroupDialogue(featureGroup: FeatureGroup) {
    this.deleteDialogRef = this.dialog.open(DeleteFeatureGroupDialogComponent, {height: '14.5em'});
    this.deleteDialogRef.componentInstance.featureGroupName = featureGroup.name;
    this.deleteDialogRef.afterClosed().subscribe(
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

