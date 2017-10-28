import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';

 
@Component({
    moduleId: module.id,
    selector: 'hip-create-achievement-dialog',
    styleUrls: ['create-achievements-dialog.component.css'],
    templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent  {

    exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
    // routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();
    description: string;
    achievementType = ['ExhibitsVisited', 'RouteFinished'];
    image = new Image();
    medium = new Medium();
    acceptedTypes = '';
  
    constructor(private createDialogRef:MdDialogRef<CreateAchievementsDialogComponent>,        
    ) {};

    private setAcceptedTypes() {
         if (this.medium.isImage()) {
            this.acceptedTypes = '.jpg,.jpeg,.png';
          } else {
            this.acceptedTypes = '';
          }
        }

    // create achievement

    createAchievement(exhibitsVisitedAchievement){
      alert(exhibitsVisitedAchievement);

    }
  
}
