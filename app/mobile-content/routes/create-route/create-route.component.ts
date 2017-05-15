import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Route } from '../route.model';

@Component({
    moduleId: module.id,
    selector: 'hip-routes-detail-dialog',
    templateUrl: 'create-route.component.html'
})
export class CreateRouteComponent {
    route: Route = Route.emptyRoute();
    constructor(public dialogRef: MdDialogRef<CreateRouteComponent>) {}

}
