import { Component, Output, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';


import { Route } from '../shared/route.model';

@Component({
    moduleId: module.id,
    selector: 'hip-create-route-dialog',
    templateUrl: 'create-route-dialog.component.html'
})
export class CreateRouteDialogComponent {
    myEvent = new EventEmitter();
    route = Route.emptyRoute();

    constructor(public dialogRef: MdDialogRef<CreateRouteDialogComponent>) { }

    createNewRoute(newRoute) {
        this.myEvent.emit(newRoute);
    }
}
