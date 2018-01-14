import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Response } from '_debugger';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';
import { MediaService } from '../../media/shared/media.service';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { AchievementService } from '../shared/achievement.service';


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
  previewURL: SafeUrl;
  file: File;
  isPreviewURL = false;
  acceptedTypes = '';
  existingImage: any = null;

  exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
  routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('autosize') autosize: any;

  constructor(private achievementService: AchievementService,
    private toasterService: ToasterService,
    private router: Router,
    private translateService: TranslateService,
    private activatedAchievement: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private mediaService: MediaService
  ) { }

  ngOnInit() {
    let context = this;
    this.id = +this.activatedAchievement.snapshot.params['id'];
    this.achievementService.getAchievement(this.id)
      .then(
      (response: Achievement) => {
        this.achievement = response;
        setTimeout(function () { context.autosize.resizeToFitContent(); }, 250);
      }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching achievement'), error);
      }
      );
    this.previewImage(this.id);
  }

  // preview image

  private previewImage(id: number) {
    this.achievementService.getImage(id, true)
      .then(
      response => {
        let base64Data: string;
        let reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          base64Data = reader.result;
          this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
        };
      }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching achievement'), error);
      }
      );
  }

  // Update achievement method

  updateAchievement(achievement) {

    if (this.achievement.type === 'ExhibitsVisited') {
      this.achievementService.updateExhibitVisitedAchievement(this.achievement)
        .then(
        res => {
          setTimeout(() => {
            this.handleResponseUpdate();
            this.router.navigate(['/mobile-content/achievements']);
          }, 500);
          if (this.file) {
            return this.achievementService.uploadImage(this.file, this.achievement.id)
              .then(
              () => {
                setTimeout(() => {
                  this.router.navigate(['/mobile-content/achievements']);
                }, 500);
              }
              );
          }
        }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
        }
        );
    }
    if (this.achievement.type === 'RouteFinished') {
      this.achievementService.updateRouteFinishedAchievement(this.achievement)
        .then(
        res => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/mobile-content/achievements']);
          }, 500);
          if (this.file) {
            this.achievementService.uploadImage(this.file, this.achievement.id)
              .then(
              () => {
                setTimeout(() => {
                  this.router.navigate(['/mobile-content/achievements']);
                }, 500);
              }
              );
          }
        }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
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
    }
  }

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

  getTranslatedString(data: any) {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.achievement.title + ' - ' + this.getTranslatedString('Achievement updated'));
  }

}
