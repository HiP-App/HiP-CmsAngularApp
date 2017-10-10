import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Achievement } from './shared/achievement.model';

import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';

@Component({
    moduleId: module.id,
    selector: 'hip-achievements',
    styleUrls: ['achievements.component.css'],
    templateUrl: 'achievements.component.html'
})

export class AchievementsComponent implements OnInit {

    achievements: Achievement[] = [];

    constructor(
        private router: Router,
        private routeService: RouteService,
        private toasterService: ToasterService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.achievements.push(
            new Achievement(
                1,
                'First exhibit visited',
                'Congratulations, you have visited yout first exhibit!',
                'EXHIBITS_VISITED',
                'PUBLISHED',
                1,
                '1'),
            new Achievement(
                2,
                'Tenth exhibit visited',
                'Congratulations, you have visited yout tenth exhibit!',
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
