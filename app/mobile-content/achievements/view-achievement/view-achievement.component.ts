import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NgModule } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AchievementService } from '../shared/achievement.service';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';
import { RouteFinishedAchievement } from '../shared/route-finished-achievement.model';
import { ExhibitsVisitedAchievement } from '../shared/exhibits-visited-achievement.model';
import { RouteService } from '../../routes/shared/routes.service';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Route } from '../../routes/shared/route.model';
import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';


@Component({
    moduleId: module.id,
    selector: 'view-achievement',
    templateUrl: 'view-achievement.component.html',
    styleUrls: ['view-achievement.component.css']
})

export class ViewAchievementComponent implements OnInit {

    achievement: any;
    id: number;
    previewURL: SafeUrl;
    achievements: Achievement[];

    canDelete = true;
    canEdit = true;

    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

    exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
    routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();

    constructor(private routeService: RouteService,
        private router: Router,
        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private achievementService: AchievementService,
        private dialog: MdDialog,
        private translateService: TranslateService,
        private exhibitService: ExhibitService,
        private spinnerService: NgxSpinnerService,
        private userService: UserService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.getId();
    }

    private getId() {
        this.route.params
            .subscribe(params => {
                this.id = +params['id'];
                this.getAchievement();
            });
    }

    private getAchievement() {
        this.achievementService
            .getAchievement(this.id)
            .then((achievement: Achievement) => {
                this.spinnerService.hide();
                this.achievement = achievement;
                this.getCurrentUser();
                this.getRoute();
                this.getImage(this.id);
            })
            .catch((error: any) => {
                this.toasterService.pop('error', this.translate('Error fetching achievement'), error);
                this.spinnerService.hide();
            });
    }

    // implimented this method so that student can only edit or delete his exhibit only.

    getCurrentUser() {
        this.userService.getCurrent()
            .then(
                (response) => {
                    let currentUserId = response.id;
                    for (let role of response.roles) {
                        if (role === 'Student') {
                            if (currentUserId !== this.achievement.userId) {
                                this.canDelete = false;
                                this.canEdit = false;
                            } else {
                                this.canDelete = true;
                                this.canEdit = true;
                            }
                        }
                    }

                }
            );
    }

    getRoute() {
        this.routeService.getRoute(this.achievement.routeId)
            .then(
                response => {
                    this.achievement.routeTitle = response.title;
                }
            )
            .catch(
                (error: any) => {
                    console.error(error);
                }
            );
    }

    private getImage(id: number) {
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
                    this.toasterService.pop('error', this.translate('Error fetching achievement'), error);
                }
            );
    }

    deleteAchievement(achievement: Achievement) {
        let context = this;
        this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
            data: {
                title: this.translateService.instant('Delete achievement'),
                message: this.translateService.instant('Confirm delete achievement', { title: achievement.title }),
            }
        });
        this.deleteDialogRef.afterClosed().subscribe(
            (confirmed: boolean) => {
                if (confirmed) {
                    this.achievementService.deleteAchievement(achievement.id)
                        .then(
                            () => {
                                // tslint:disable-next-line:max-line-length
                                this.toasterService.pop('success', 'Success', achievement.title + ' - ' + this.translate('Achievement deleted'));
                                this.router.navigate(['../../'], { relativeTo: this.route });
                            }

                        ).catch(
                            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
                        );
                }
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
}
