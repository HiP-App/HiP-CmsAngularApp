import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdCheckboxChange } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './create-feature-dialog/create-feature-dialog.component';
import { DeleteFeatureDialogComponent } from './delete-feature-dialog/delete-feature-dialog.component';
import { Feature } from './shared/feature.model';
import { FeatureGroup } from '../manage-feature-groups/shared/feature-group.model';
import { FeatureService } from './shared/feature.service';
import { FeatureGroupService } from '../manage-feature-groups/shared/feature-group.service';

@Component({
  moduleId: module.id,
  selector: 'hip-feature',
  templateUrl: 'feature.component.html',
  styleUrls: ['feature.component.css']
})

export class FeatureComponent implements OnInit {
  private featureGroups: FeatureGroup[];
  private features: Feature[];

  // dialogs
  private dialogRef: MdDialogRef<CreateFeatureDialogComponent>;
  private deleteRef: MdDialogRef<DeleteFeatureDialogComponent>;

  constructor(private dialog: MdDialog,
              private featureGroupService: FeatureGroupService,
              private featureService: FeatureService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.features = [new Feature(1, 'Test'), new Feature(2, 'Test 2')]; // TODO remove this line
    this.featureGroups = [new FeatureGroup(5, 'X', ['test@test.de', 'test2@test.de'], [1]),
      new FeatureGroup(5, 'Y', [], [2])]; // TODO remove this line
    this.loadFeatures();
    this.loadFeatureGroups();
  }

  loadFeatures() {
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

  createFeature() {
    this.dialogRef = this.dialog.open(CreateFeatureDialogComponent);
    this.dialogRef.afterClosed().subscribe(
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
        this.dialogRef = null;
      }
    );
  }

  deleteFeature(feature: Feature) {
    this.deleteRef = this.dialog.open(DeleteFeatureDialogComponent);
    this.deleteRef.componentInstance.featureName = feature.name;
    this.deleteRef.afterClosed().subscribe(
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
        this.deleteRef = null;
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
