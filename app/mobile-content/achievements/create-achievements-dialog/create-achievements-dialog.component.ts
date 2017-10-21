import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialogRef } from '@angular/material';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';


@Component({
    moduleId: module.id,
    selector: 'hip-create-achievement-dialog',
    styleUrls: ['create-achievements-dialog.component.css'],
    templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent  {
    achievement = Achievement.emptyAchievement();
    achievementsTypes = ['ExhibitsVisited', 'First_finder'];
    image = new Image();
    name: string;
    description: any;
    acceptedTypes = '';
}

