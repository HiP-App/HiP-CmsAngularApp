import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateRouteDialogComponent } from './create-route-dialog/create-route-dialog.component';
import { Route } from './shared/route.model';
import { Status } from '../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes: Route[];
  statuses = Status.getValuesForSearch();

  // search parameters
  searchQuery = '';
  selectedStatus = '';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;

  private createDialogRef: MdDialogRef<CreateRouteDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private translateService: TranslateService) {}

  ngOnInit() {
    // TODO: replace dummy data with appropriate API calls
    this.routes = new Array(30);
    this.totalItems = this.routes.length;
    for (let i = 0; i < this.routes.length; i++) {
      this.routes[i] = Route.getRandom();
    }
  }

  createRoute() {
    this.createDialogRef = this.dialog.open(CreateRouteDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
      (newRoute: Route) => {
        if (newRoute) {
          // TODO: handle route creation
        }
      }
    );
  }

  deleteRoute(route: Route) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete route'),
        message: this.translateService.instant('confirm delete route', { name : route.title })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          // TODO: implement route deletion
        }
      }
    );
  }

  findRoutes() {
    this.showingSearchResults = true;
    // TODO
  }

  getPage(page: number) {
    this.currentPage = page;
    // TODO: implement pagination
  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
    this.showingSearchResults = false;
    // TODO
  }

}
