import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';


import { RoutesDetailComponent } from './routes-detail/routes-detail.component';


@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {

  private dialogRef: MdDialogRef<RoutesDetailComponent>;

  constructor(private dialog: MdDialog) {}

  ngOnInit() {
    // TODO fetch data using your RouteService.
  }

  createRoute() {
    return;
  }

    editRoute() {
      this.dialogRef = this.dialog.open(RoutesDetailComponent, { height: '80%', width: '80%' });

    }
}
