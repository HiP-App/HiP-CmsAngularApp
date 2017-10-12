import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialogRef } from '@angular/material';
import { Achievement } from '../shared/achievement.model';



@Component({
    moduleId: module.id,
    selector: 'hip-create-achievement-dialog',
    styleUrls: ['create-achievements-dialog.component.css'],
    templateUrl: 'create-achievements-dialog.component.html'
})
export class CreateAchievementsDialogComponent implements OnInit {
    aTypes = ['Type 1', 'Type 2'];
    name: string;
    title: string;
    description: any;


    constructor (
    ) { }

    ngOnInit() {
    }
}
