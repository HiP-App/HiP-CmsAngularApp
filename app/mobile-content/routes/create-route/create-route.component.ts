import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    moduleId: module.id,
    selector: 'hip-routes-detail-dialog',
    templateUrl: 'create-route.component.html'
})
export class CreateRouteComponent {

    constructor(public dialogRef: MdDialogRef<CreateRouteComponent>) {}

}
