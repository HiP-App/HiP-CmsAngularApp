import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { AchievementService } from '../shared/achievement.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
    moduleId: module.id,
    selector: 'hip-edit-achievement-dialog',
    styleUrls: ['edit-achievements-dialog.component.css'],
    templateUrl: 'edit-achievements-dialog.component.html'
})
export class EditAchievementsDialogComponent implements OnInit {
    id: number;
    //achievement = Achievement.emptyAchievement()
    constructor ( private achievementService : AchievementService,
                  private toasterService : ToasterService,
                  private router: Router,
                  private translateService: TranslateService
                )   { }

    ngOnInit()
    { 
      
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
      
    getTranslatedString(data: any) {
        let translatedResponse: string;
        this.translateService.get(data).subscribe(
          (value: string) => {
            translatedResponse = value;
          }
        );
        return translatedResponse;
      }
}


