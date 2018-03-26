import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';

@Component({
    moduleId: module.id,
    selector: 'hip-select-exhibit-dialog',
    templateUrl: 'select-exhibit-dialog.component.html',
    styleUrls: ['select-exhibit-dialog.component.css']
})
export class SelectExhibitDialogComponent implements OnInit {

    @Output() onExhibitSelected = new EventEmitter<Exhibit>();
    exhibits: Exhibit[];

    constructor(
        public dialogRef: MdDialogRef<SelectExhibitDialogComponent>,
        private exhibitService: ExhibitService
    ) {}

    ngOnInit() {
        this.exhibitService.getAllExhibits(1, 1000)
        .then(
            response => this.exhibits = response.items
        )
        .catch(
            //
        );
    }
}
