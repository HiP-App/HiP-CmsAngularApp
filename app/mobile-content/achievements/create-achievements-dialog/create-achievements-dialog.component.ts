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

 
@Component({
    moduleId: module.id,
    selector: 'hip-create-achievement-dialog',
    styleUrls: ['create-achievements-dialog.component.css'],
    templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent implements OnInit {

    selectedType: any=null;
    achievement: any;  

    exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
    routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
    
    // achievementTypes = ['ExhibitsVisited', 'RouteFinished'];
    title: string;
    achievementTypes: any;
    image = new Image();
    medium = new Medium();
    acceptedTypes = '';
  
    constructor(private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>,
                private toasterService: ToasterService,
                private achievementService: AchievementService,
                private dialog: MdDialog        
    ) {};

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

    private setAcceptedTypes() {
         if (this.medium.isImage()) {
            this.acceptedTypes = '.jpg,.jpeg,.png';
          } else {
            this.acceptedTypes = '';
          }
        }
      
        setAchivementType(type){
          
          this.selectedType = type;

          if(this.selectedType == 'ExhibitsVisited')
          {
            this.achievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
            this.achievement.type = this.selectedType;
            console.log(this.achievement);
          }
          if(this.selectedType == 'RouteFinished')
          {
            this.achievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
            this.achievement.type = this.selectedType;
            console.log(this.achievement);
          }
        }

        // Create achievement method

    createAchievement(){
          
          if(this.selectedType == 'ExhibitsVisited')
            {
              console.log(this.achievement);
              this.achievementService.createExhibitVisitedAchievement(this.achievement)
              .then(
                () => {
                  console.log("success");
                  }
              )
                  .catch(
                    error => {
                      console.log("erro while saving")
                  }
              )
            }
          if(this.selectedType == 'RouteFinished')
            {
              console.log(this.achievement);
              this.achievementService.createRouteFinishedAchievement(this.achievement)
              .then(
                () => {
                  console.log("success");
                  }
              )
                  .catch(
                    error => {
                      console.log("erro while saving")
                  }
              )
            }
          }
                  
          
        
}
