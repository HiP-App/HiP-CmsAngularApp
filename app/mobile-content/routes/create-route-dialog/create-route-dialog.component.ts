import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Route } from '../shared/route.model';

@Component({
    moduleId: module.id,
    selector: 'hip-create-route-dialog',
    templateUrl: 'create-route-dialog.component.html'
})
export class CreateRouteDialogComponent {
    route = Route.emptyRoute();

    constructor(public dialogRef: MdDialogRef<CreateRouteDialogComponent>) {}
}
