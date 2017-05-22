import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Route } from '../shared/route.model';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-route-dialog',
  templateUrl: 'delete-route-dialog.component.html'
})
export class DeleteRouteDialogComponent {
  route: Route;

  constructor(public dialogRef: MdDialogRef<DeleteRouteDialogComponent>) { }
}
