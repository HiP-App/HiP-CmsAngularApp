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


@Component({
  moduleId: module.id,
  selector: 'hip-create-achievement-dialog',
  styleUrls: ['create-achievements-dialog.component.css'],
  templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent implements OnInit {
  // id: number;
  selectedType: any = null;
  achievement: any;
  title: string;
  achievementTypes: any;
  image = new Image();
  routeTypes: ['Route1', 'Route2'];
  routeType: any = null;
  
  acceptedTypes = '';
  private achievementCache = new Map<number, Achievement[]>();

  exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
  routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();


  constructor(private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>,
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
      error => console.error(error)
      );
  };

//   ngOnInIt() {
//     this.achievementService.getRoute(this.id)
//     .then(
//     data => {
//       this.routeType = data;
//     }
//     ).catch(
//     error => console.error(error)
//     );
// };
  

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
      console.log(this.achievement);
    }
    if (this.selectedType == 'RouteFinished') {
      this.achievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
      this.achievement.type = this.selectedType;
      console.log(this.achievement);
    }
  }

  setRouteType(type) {

    this.routeType = type;
  }




  // Create achievement method

  createAchievement() {
    if (this.selectedType == 'ExhibitsVisited') {
      console.log(this.achievement);
      let context = this;
      this.achievementService.createExhibitVisitedAchievement(this.achievement)
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
        )
    }

    if (this.selectedType == 'RouteFinished') {
      console.log(this.achievement);
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
        )
    }
  }
}
