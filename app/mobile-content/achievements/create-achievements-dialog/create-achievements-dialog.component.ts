import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NgModule } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { ActivatedRoute, Router } from '@angular/router';

import { AchievementService } from '../shared/achievement.service';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';
import { RouteService } from '../../routes/shared/routes.service';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Route } from '../../routes/shared/route.model';
import { Status } from '../../shared/status.model';


@Component({
  moduleId: module.id,
  selector: 'hip-create-achievement-dialog',
  styleUrls: ['create-achievements-dialog.component.css'],
  templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent implements OnInit {
  achievements: Achievement[] = [];
  selectedType: any = null;
  statusOptions = Status.getValues();
  selectedExhibit: any = null;
  achievement: any;
  title: string;
  achievementTypes: any;
  image = new Image();
  selectedRoute: any;
  routeType: any;
  acceptedTypes = '';
  exhibits: Exhibit[] = [];
  routeTypes: Route[] = [];

  // pagination parameters
  achievementsPerPage = 10;
  currentPage = 1;
  totalItems: number;

  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  showingSearchResults = false;

  fileToUpload: any;
  id: number;
  file: File;
  previewURL: string;
  previewedImage: any;

  private achievementCache = new Map<number, Achievement[]>();

  exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
  routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();


  constructor(private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>,
    private routeService: RouteService,
    private router: Router,
    private toasterService: ToasterService,
    private activatedAchievement: ActivatedRoute,
    private achievementService: AchievementService,
    private dialog: MdDialog,
    private translateService: TranslateService,
    private exhibitService: ExhibitService
  ) { }

  ngOnInit() {
    this.achievementService.getAchievementTypes()
      .then(
        data => {
          this.achievementTypes = data;
        }
      ).catch(
        error => {
          this.toasterService.pop('error', this.translate('Error while fetching'), error);
        }
      );
  }

  // Get achievement type
  setAchivementType(type) {
    this.selectedType = type;

    if (this.selectedType === 'ExhibitsVisited') {
      this.achievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
      this.achievement.type = this.selectedType;
    }
    if (this.selectedType === 'RouteFinished') {
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
  // Set route
  setRoute(type) {
    this.achievement.routeId = type.value.id;
  }

  // Create achievement method
  createAchievement() {
    if (this.selectedType === 'ExhibitsVisited') {
      let context = this;
      this.achievementService.createExhibitVisitedAchievement(this.achievement)
        .then(
          res => {
            if (this.file) {
              return this.achievementService.uploadImage(this.file, res)
                .then(
                  () => {
                    this.toasterService.pop('success', this.translate('achievement saved'));
                    this.createDialogRef.close();
                    setTimeout(function () {
                      context.reloadList();
                    }, 1000);
                  }
                );
            }
          },
      ).catch(
        error => this.toasterService.pop('error', this.translate('Title can not be empty'))
      );
    }

    if (this.selectedType === 'RouteFinished') {
      let context = this;
      this.achievementService.createRouteFinishedAchievement(this.achievement)
        .then(
          res => {
            if (this.file) {
              return this.achievementService.uploadImage(this.file, res)
                .then(
                  () => {
                    this.toasterService.pop('success', this.translate('achievement saved'));
                    this.createDialogRef.close();
                    setTimeout(function () {
                      context.reloadList();
                    }, 1000);
                  }
                );
            }
          },
      ).catch(
        error => this.toasterService.pop('error', this.translate('Title and Route can not be empty'))
      );
    }
  }

  public chooseFile(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewURL = e.target.result;
        this.previewedImage = this.previewURL;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private setAcceptedTypes() {
    this.acceptedTypes = '.jpg,.jpeg';
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
    this.getPage(1);
  }

  getPage(page: number) {
    if (this.achievementCache.has(page)) {
      this.achievements = this.achievementCache.get(page);
      this.currentPage = page;
    } else {
      this.achievementService.getAllAchievements(page, this.achievementsPerPage, this.selectedStatus, this.selectedType,
        this.searchQuery, 'id', undefined)
        .then(
          data => {
            this.achievements = data.items;
            this.totalItems = data.total;
            this.currentPage = page;
            this.achievementCache.set(this.currentPage, this.achievements);
          }
        )
        .catch(
          error => console.error(error)
        );
    }
  }

  private handleError(error: any) {
    this.toasterService.pop('error', 'Error while uploading picture', error);
  }
}
