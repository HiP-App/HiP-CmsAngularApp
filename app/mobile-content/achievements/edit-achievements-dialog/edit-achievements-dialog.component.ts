import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialogRef } from '@angular/material';
import { Achievement } from '../shared/achievement.model';
import { Medium } from '../../media/shared/medium.model';


@Component({
    moduleId: module.id,
    selector: 'hip-edit-achievement-dialog',
    styleUrls: ['edit-achievements-dialog.component.css'],
    templateUrl: 'edit-achievements-dialog.component.html'
})
export class EditAchievementsDialogComponent implements OnInit {

    constructor (
    )   { }

    ngOnInit()
    { }
}

