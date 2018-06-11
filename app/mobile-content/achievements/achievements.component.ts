import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { NgxSpinnerService } from 'ngx-spinner';

import { Achievement } from './shared/achievement.model';
import { AchievementService } from './shared/achievement.service';
import { ThumbnailService, ThumbnailSize, ThumbnailMode, ThumbnailFormat } from '../shared/thumbnail.service';
import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';
import { Status } from '../shared/status.model';
import { CreateAchievementsDialogComponent } from './create-achievements-dialog/create-achievements-dialog.component';
import { EditAchievementsComponent } from './edit-achievements/edit-achievements.component';
import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { ExhibitsVisitedAchievement } from './shared/exhibits-visited-achievement.model';
import { RouteFinishedAchievement } from './shared/route-finished-achievement.model';



@Component({
    moduleId: module.id,
    selector: 'hip-achievements',
    styleUrls: ['achievements.component.css'],
    templateUrl: 'achievements.component.html'
})

export class AchievementsComponent implements OnInit, OnDestroy {

    allAchievements: Achievement[] = [];
    achievements: Achievement[] = [];
    types: String[] = [];
    previews = new Map<number, SafeUrl>();
    previewsLoaded = false;
    statuses = Status.getValuesForSearch();
    private achievementCache = new Map<number, Achievement[]>();
    title: string;
    achievement: any;
    file: File;

    // search parameters
    searchQuery = '';
    selectedStatus = 'ALL';
    selectedType = 'ALL';
    showingSearchResults = false;

    // pagination parameters
    achievementsPerPage = 10;
    currentPage = 1;
    totalItems: number;

    // dialogs
    private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>;
    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

    exhibitsVisitedAchievement = ExhibitsVisitedAchievement.emptyExhibitsVisitedAchievement();
    routeFinishedAchievement = RouteFinishedAchievement.emptyRouteFinishedAchievement();

    constructor(private dialog: MdDialog,
        private achievementService: AchievementService,
        private thumbnailService: ThumbnailService,
        private router: Router,
        private routeService: RouteService,
        private sanitizer: DomSanitizer,
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.spinnerService.show();
        this.getAllAchievements();
        this.getAchievementTypes();
        this.getPage(1);
    }

    ngOnDestroy() {
        this.spinnerService.hide();
    }

    getAllAchievements() {
        this.spinnerService.show();
        this.achievementService.getAllAchievements(1, this.achievementsPerPage)
            .then(data => {
                    this.allAchievements = data.items;
                    this.spinnerService.hide();
                });
    }

    getAchievementTypes() {
        this.achievementService.getAchievementTypes()
            .then(data => this.types = ['ALL'].concat(data));
    }

    getPage(page: number) {
        if (this.achievementCache.has(page)) {
            this.achievements = this.achievementCache.get(page);
            this.currentPage = page;
        } else {
            let status = this.selectedStatus;
            this.achievementService.getAllAchievements(page, this.achievementsPerPage, this.selectedStatus, this.selectedType,
                this.searchQuery, 'id', undefined)
                .then(
                    data => {
                        this.achievements = data.items;
                        this.totalItems = data.total;
                        this.currentPage = page;
                        this.achievementCache.set(this.currentPage, this.achievements);
                        this.loadPreviews();
                    }
                )
                .catch(
                    error => console.error(error)
                );
        }
    }

    reloadList() {
        this.achievements = undefined;
        this.achievementCache.clear();
        this.getPage(1);
    }

    resetSearch() {
        this.searchQuery = '';
        this.achievements = undefined;
        this.achievementCache.clear();
        this.getPage(1);
        this.showingSearchResults = false;
    }

    findAchievements() {
        if (this.searchQuery.trim().length >= 3) {
            this.reloadList();
            this.showingSearchResults = true;
        } else if (this.searchQuery.trim().length < 1) {
            this.resetSearch();
        }
    }

    loadPreviews() {
        let previewable = this.achievements.filter(achievement => achievement.thumbnailUrl != null && !this.previews.has(achievement.id));
        previewable.forEach(
            achievement => {
                this.thumbnailService.downloadFile(
                    achievement.thumbnailUrl,
                    ThumbnailSize.Small,
                    ThumbnailMode.FillSquare,
                    ThumbnailFormat.Png,
                    true
                )
                    .then(
                        response => {
                            let reader = new FileReader();
                            reader.readAsDataURL(response);
                            reader.onloadend = () => {
                                this.previews.set(achievement.id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
                                this.previewsLoaded = previewable.every(ach => this.previews.has(ach.id));
                            };
                        }
                    )
                    .catch(
                        error => {
                            previewable.splice(previewable.findIndex(ach => ach.id === achievement.id), 1);
                            this.previews.delete(achievement.id);
                            this.previewsLoaded = previewable.every(ach => this.previews.has(ach.id));
                        }
                    );
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

    // Open create achievement dialog box
    openCreateAchievementDialog() {
        this.createDialogRef = this.dialog.open(CreateAchievementsDialogComponent, { width: '55em' });
    }


    // Delete achievement service
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
                                setTimeout(function () {
                                    context.reloadList();
                                }, 1000);
                            }

                        ).catch(
                            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
                        );
                }
            }
        );
    }

    isDraft(achievement: Achievement) {
        return achievement.status === 'DRAFT';
    }

    getOpacity(achievement: Achievement): number {
        if (achievement.status === 'DRAFT') {
            return 0.5;
        } else {
            return 1;
        }
    }
}
