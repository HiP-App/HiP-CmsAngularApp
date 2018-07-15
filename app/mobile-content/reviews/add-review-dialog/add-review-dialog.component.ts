import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'hip-add-review-dialog',
    templateUrl: 'add-review-dialog.component.html',
    styleUrls: ['add-review-dialog.component.css']
})
export class AddReviewDialogComponent {


    constructor(
        private dialog: MdDialog,
        private toasterService: ToasterService,
        private translateService: TranslateService
    ) {}
}
