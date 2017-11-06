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
import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-achievement',
  styleUrls: ['edit-achievements.component.css'],
  templateUrl: 'edit-achievements.component.html'
})
export class EditAchievementsComponent implements OnInit {
  id: number;
  achievement: any;
  title: string;
  description: string;

  exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
  // routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();

  @ViewChild('autosize') autosize: any;

  constructor(private achievementService: AchievementService,
    private toasterService: ToasterService,
    private router: Router,
    private translateService: TranslateService,
    private activatedExhibit: ActivatedRoute
  ) { }

  ngOnInit() {
    let context = this;
    this.id = +this.activatedExhibit.snapshot.params['id'];
    this.achievementService.getAchievement(this.id)
      .then(
      (response: Achievement) => {
        this.achievement = response;
        console.log(response);
        setTimeout(function () { context.autosize.resizeToFitContent(); }, 250);
      }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching exhibit'), error);
      }
      );
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

  // Update achievement method
  
  updateAchievement(achievement) {
    if (this.achievement.type == 'ExhibitsVisited') {
      this.achievementService.updateExhibitVisitedAchievement(this.achievement)
        .then(
        () => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/mobile-content/achievements']);
          }, 500);
        }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
        }
        );
    }
    if (this.achievement.type == 'RouteFinished') {
      this.achievementService.updateRouteFinishedAchievement(this.achievement)
        .then(
        () => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/mobile-content/achievements']);
          }, 500);
        }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
        }
        );
    }
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.achievement.title + ' - ' + this.getTranslatedString('Achievement updated'));
  }

}