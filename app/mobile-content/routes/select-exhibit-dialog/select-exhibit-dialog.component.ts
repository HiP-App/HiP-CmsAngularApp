import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

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
        private exhibitService: ExhibitService,
        private toasterService: ToasterService,
        private translateService: TranslateService
    ) {}

    ngOnInit() {
        this.exhibitService.getAllExhibits(1, 1000)
        .then(
            response => this.exhibits = response.items
        )
        .catch(
            (error: any) =>  this.toasterService.pop('error', this.getTranslatedString('Error fetching exhibits'), error)
        );
    }

    getTranslatedString(data: any) {
        let translatedResponse: string;
        this.translateService.get(data).subscribe(
          (value: any) => {
            translatedResponse = value;
          }
        );
        return translatedResponse;
      }
}
