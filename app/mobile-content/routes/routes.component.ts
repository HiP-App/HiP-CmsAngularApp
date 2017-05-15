import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateRouteComponent } from './create-route/create-route.component';
import { Route } from './route.model';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes: Route[];
  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;

  private dialogRef: MdDialogRef<CreateRouteComponent>;
  constructor(private dialog: MdDialog) {}
  ngOnInit() {
    // TODO: replace dummy data with appropriate API calls
    this.routes = new Array(30);
    this.totalItems = this.routes.length;
    for (let i = 0; i < this.routes.length; i++) {
      this.routes[i] = Route.getRandom();
    }
  }
  getPage(page: number) {
    this.currentPage = page;
    // TODO: implement pagination
  }
  createRoute() {
    this.dialogRef = this.dialog.open(CreateRouteComponent, { height: '22em', width: '45em' });
  }
  editRoute() {
      return;
    }
}
