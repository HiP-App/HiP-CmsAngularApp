import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Achievement } from './shared/achievement.model';
import { AchievementService } from './shared/achievement.service';

import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';
import {CreateAchievementsDialogComponent} from './create-achievements-dialog/create-achievements-dialog.component';

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

    constructor(
        private achievementService: AchievementService,
        private dialog: MdDialog,
        private router: Router,
        private routeService: RouteService,
        private toasterService: ToasterService,
        private translateService: TranslateService
    ) { }

    // Create achievement method
    createAchievements() {
          this.createDialogRef = this.dialog.open(CreateAchievementsDialogComponent, { width: '45em'});

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
}
