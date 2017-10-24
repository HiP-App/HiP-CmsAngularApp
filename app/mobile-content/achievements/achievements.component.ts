import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Achievement } from './shared/achievement.model';
import { AchievementService } from './shared/achievement.service';

import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';
import { CreateAchievementsDialogComponent } from './create-achievements-dialog/create-achievements-dialog.component';
import { EditAchievementsDialogComponent} from './edit-achievements-dialog/edit-achievements-dialog.component';
import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
    moduleId: module.id,
    selector: 'hip-achievements',
    styleUrls: ['achievements.component.css'],
    templateUrl: 'achievements.component.html'
})

export class AchievementsComponent implements OnInit {

    achievements: Achievement[] = [];
    searchQuery = '';
    isSearch = false;

    statuses = ['DRAFT', 'IN_REVIEW', 'PUBLISHED'];
    types = ['EXHIBITS_VISITED', 'FIRST_FINDER'];

    selectedStatus = '';
    selectedType = '';

    // dialogs
    private createDialogRef: MdDialogRef<CreateAchievementsDialogComponent>;
    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>; 
    private editDialogRef: MdDialogRef<EditAchievementsDialogComponent>;

    constructor(private achievementService: AchievementService,
                private dialog: MdDialog,
                private router: Router,
                private routeService: RouteService,
                private toasterService: ToasterService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        this.achievements.push(
            new Achievement(
                1,
                'First exhibit visited',
                'Congratulations, you have visited your first exhibit!',
                'EXHIBITS_VISITED',
                'PUBLISHED',
                1,
                '1'),
            new Achievement(
                2,
                'Tenth exhibit visited',
                'Congratulations, you have visited your tenth exhibit!',
                'EXHIBITS_VISITED',
                'PUBLISHED',
                2,
                '2'));
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

    // Create achievement method

    createAchievements() {
        let context = this;
        this.createDialogRef = this.dialog.open(CreateAchievementsDialogComponent, {width: '45em'});
        this.createDialogRef.afterClosed().subscribe(
            (newAchievement: Achievement) => {
                if (newAchievement) {
                    this.achievementService.createAchievement(newAchievement)
                        .then(
                            () => {
                                this.toasterService.pop('success', this.translate('achievement saved'));
                                setTimeout(function () {
                                    context.reloadList();
                                }, 1000);
                            }
                        ).catch(
                        error => this.toasterService.pop('error', this.translate('Error while saving'), error)
                    );
                }
                this.createDialogRef = null;
            }
        );
    }

    // Delete achievement method

    deleteAchievements(achievement: Achievement) {
        let context = this;
        this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
            data: {
                title: this.translateService.instant('delete achievement    '),
                message: this.translateService.instant('confirm delete achievement', {name: achievement.id})
            }
        });
        this.deleteDialogRef.afterClosed().subscribe(
            (confirmed: boolean) => {
                if (confirmed) {
                    this.achievementService.deleteAchievement(achievement.id)
                        .then(
                            () => {
                                this.toasterService.pop('success', 'Success', achievement.id + ' - ' + this.translate('achievement deleted'));
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

    editAchievements(achievement: Achievement) {
        this.editDialogRef = this.dialog.open(EditAchievementsDialogComponent, {width: '45em'});
    }

    
    reloadList() {
        this.achievements = undefined;
        /*this.achievementsCache.clear();
        this.getPage(1);*/
    }

}

