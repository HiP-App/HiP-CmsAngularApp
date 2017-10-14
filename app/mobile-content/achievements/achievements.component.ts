import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Achievement } from './shared/achievement.model';
import { AchievementService } from './shared/achievement.service';
import { MediaService } from '../media/shared/media.service';
import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';
import { Status } from '../shared/status.model';

@Component({
    moduleId: module.id,
    selector: 'hip-achievements',
    styleUrls: ['achievements.component.css'],
    templateUrl: 'achievements.component.html'
})

export class AchievementsComponent implements OnInit {
    allAchievements: Achievement[] = [];
    achievements: Achievement[] = [];
    previews = new Map<number, SafeUrl>();
    previewsLoaded = false;
    statuses = Status.getValuesForSearch();
    private achievementCache = new Map<number, Achievement[]>();

    // search parameters
    searchQuery = '';
    selectedStatus = 'ALL';
    selectedType = '';
    showingSearchResults = false;

    // pagination parameters
    achievementsPerPage = 10;
    currentPage = 1;
    totalItems: number;

    types = ['EXHIBITS_VISITED', 'FIRST_FINDER'];

    constructor(
        private achievementService: AchievementService,
        private mediaService: MediaService,
        private router: Router,
        private routeService: RouteService,
        private sanitizer: DomSanitizer,
        private toasterService: ToasterService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.getAllAchievements();
        //this.getPage(1);
    }

    getAllAchievements() {
        // this.achievementService.getAllAchievements(1, this.achievementsPerPage)
        //     .then(data => this.allAchievements = data.items);
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

    deleteAchievement(achievement: Achievement) {
    }

    getPage(page: number) {
        if (this.achievementCache.has(page)) {
            this.achievements = this.achievementCache.get(page);
            this.currentPage = page;
        } else {
            this.achievementService.getAllAchievements(page, this.achievementsPerPage, this.selectedStatus,
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
        let previewable = this.achievements.filter(achievement => achievement.image != null && !this.previews.has(achievement.id));
        previewable.forEach(
            achievement => {
                this.mediaService.downloadFile(achievement.image, true)
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
}
