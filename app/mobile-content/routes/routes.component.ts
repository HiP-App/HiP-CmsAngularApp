import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateRouteComponent } from './create-route/create-route.component';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {

  private dialogRef: MdDialogRef<CreateRouteComponent>;
  constructor(private dialog: MdDialog) {}
  ngOnInit() {
    // TODO fetch data using your RouteService.
  }
  createRoute() {
    this.dialogRef = this.dialog.open(CreateRouteComponent, { height: '20em', width: '45em' });
  }
  editRoute() {
      return;
    }
}
