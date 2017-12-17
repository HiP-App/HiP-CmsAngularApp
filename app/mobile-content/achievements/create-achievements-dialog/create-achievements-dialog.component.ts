import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';
import { NgModule } from '@angular/core';
import { AchievementService } from '../shared/achievement.service';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { RouteService } from '../../routes/shared/routes.service';



@Component({
  moduleId: module.id,
  selector: 'hip-create-achievement-dialog',
  styleUrls: ['create-achievements-dialog.component.css'],
  templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent implements OnInit {

  selectedType: any = null;
  achievement: any;
  title: string;
  achievementTypes: any;
  image = new Image();
  selectedRoute: any;
  routeTypes: any;
  acceptedTypes = '';
  isUploaded = true;
  fileToUpload: any;
  id: number;
  file: File;
  previewURL: string;


  private achievementCache = new Map<number, Achievement[]>();

  exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
  routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();


  constructor(private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>,
    private routeService: RouteService,
    private toasterService: ToasterService,
    private achievementService: AchievementService,
    private dialog: MdDialog,
    private translateService: TranslateService
  ) { };

  ngOnInit() {
    this.achievementService.getAchievementTypes()
      .then(
      data => {
        this.achievementTypes = data;
      }
      ).catch(
      error => {
        this.toasterService.pop('error', this.translate('Error while fetching'), error)
      }
      );
  };

  private setAcceptedTypes() {
    this.acceptedTypes = '.jpg,.jpeg,.png';

  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  reloadList() {
    this.achievement = undefined;
    this.achievementCache.clear();
    // this.getPage(1);
  }

  // Get achievement type

  setAchivementType(type) {
    this.selectedType = type;

    if (this.selectedType == 'ExhibitsVisited') {
      this.achievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
      this.achievement.type = this.selectedType;
    }
    if (this.selectedType == 'RouteFinished') {
      this.achievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
      this.achievement.type = this.selectedType;
      this.routeService.getAllRoutes(1, 1000)
        .then(
        data => {
          this.routeTypes = data.items;
        }
        ).catch(
        error => console.error(error)
        );
    }
  }

  // Create achievement method

  createAchievement() {
    if (this.selectedType === 'ExhibitsVisited') {

      let context = this;
      this.achievementService.createExhibitVisitedAchievement(this.achievement)
        .then(
          res => {
            console.log('Response', res)
            if (this.file) {
              console.log('File in CA', this.file)
              return this.achievementService.uploadImage( this.file, res);
            }
          },
        () => {
          this.toasterService.pop('Success', this.translate('New achievement saved'));
          setTimeout(function () {
            context.reloadList();
          }, 1000);
        }
        ).catch(
        error => {
          this.toasterService.pop('error', this.translate('Error while saving'), error)
        }
        );
    }

    if (this.selectedType === 'RouteFinished') {

      let context = this;
      this.achievementService.createRouteFinishedAchievement(this.achievement)
        .then(
        () => {
          this.toasterService.pop('Success', this.translate('New achievement saved'));
          setTimeout(function () {
            context.reloadList();
          }, 1000);
        }
        ).catch(
        error => {
          this.toasterService.pop('error', this.translate('Error while saving'), error)
        }
        );
    }

}

public chooseFile(event: any) {
  this.file = event.target.files[0];
  if (event.target.files && event.target.files[0]) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewURL = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    this.resize(this.file);
  }
}

resize(file: any, MAX_WIDTH = 100, MAX_HEIGHT = 100) {
  let canvas = document.createElement('canvas');
  let width = file.width;
  let height = file.height;
  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width;
      width = MAX_WIDTH;
    }
  } else {
    if (height > MAX_HEIGHT) {
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
    }
  }
  canvas.width = width;
  canvas.height = height;
  return canvas.toDataURL('image/jpeg');
}

  private handleResponse(msg: string) {
    this.toasterService.pop('success', msg);
  }

  private handleError(error: any) {
    this.toasterService.pop('error', 'Error while uploading picture', error);
  }

}
