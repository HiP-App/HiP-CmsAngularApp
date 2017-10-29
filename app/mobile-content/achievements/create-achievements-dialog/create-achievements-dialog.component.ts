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

 
@Component({
    moduleId: module.id,
    selector: 'hip-create-achievement-dialog',
    styleUrls: ['create-achievements-dialog.component.css'],
    templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent  {

    selectedValue: any=null;
    achievement: any;  

    exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
    routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
    
    // achievementTypes = ['ExhibitsVisited', 'RouteFinished'];
    achievementTypes = [];
    image = new Image();
    medium = new Medium();
    acceptedTypes = '';
  
    constructor(private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>,
                private achievementService: AchievementService,
                private dialog: MdDialog        
    ) {};

    private setAcceptedTypes() {
         if (this.medium.isImage()) {
            this.acceptedTypes = '.jpg,.jpeg,.png';
          } else {
            this.acceptedTypes = '';
          }
        }

        CreateAchievement(sample){
          if(sample =='ExhibitsVisited')
            {
              
              this.achievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
              this.achievement.type = sample;

                            
            }
          if(sample =='RouteFinished')
            {
              
              this.achievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
              this.achievement.type = sample;
            }
          
          
        }

    
}
