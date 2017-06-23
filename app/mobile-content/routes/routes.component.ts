import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateRouteDialogComponent } from './create-route-dialog/create-route-dialog.component';
import { DeleteRouteDialogComponent } from './delete-route-dialog/delete-route-dialog.component';
import { Route } from './shared/route.model';
import { Status } from '../shared/status.model';
import { RouteService } from './shared/routes.service';
import { Tag } from '../tags/shared/tag.model';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes: Route[];
  private routeCache = new Map<number, Route[]>();
  private translatedResponse: string;
  statuses = Status.getValuesForSearch();
  existingTags: Tag[];
  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  showingSearchResults = false;
  // pagination parameters
  routesPerPage = 10;
  currentPage = 1;
  totalItems: number;
  private createDialogRef: MdDialogRef<CreateRouteDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteRouteDialogComponent>;

  constructor(private dialog: MdDialog,
              private routeService: RouteService,
              public router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.getPage(1);
  }

  createRoute() {
    let context = this;
    this.createDialogRef = this.dialog.open(CreateRouteDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
      (newRoute: Route) => {
        if (newRoute) {
          this.routeService.createRoute(newRoute)
            .then(
              response => {this.toasterService.pop('success', this.translate('route saved'));
                setTimeout(function(){
                  context.reloadList();
                }, 1000);
              }
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  getTagNames() {
    let tagArray = '?';
    for (let i = 0; i < this.routes.length; i++ ) {
      for ( let j = 0; j < this.routes[i].tags.length; j++ ) {
        if (tagArray.indexOf(this.routes[i].tags[j]) === -1) {
          tagArray = tagArray + 'IncludeOnly=' + this.routes[i].tags[j] + '&';
        }
      }
    }
    this.routeService.getTagNames(tagArray).then(
      response => {
        this.existingTags = response;
      }
    ).catch(
      error => this.toasterService.pop('error', this.translate('Error while saving'), error)
    );
  }
  getPage(page: number) {
    if (this.routeCache.has(page)) {
      this.routes = this.routeCache.get(page);
      this.currentPage = page;
    } else {
      this.routeService.getAllRoutes(page, this.routesPerPage, this.selectedStatus, this.searchQuery )
        .then(
          data => {
            this.routes = data.items;
            this.totalItems = data.total;
            this.currentPage = page;
            this.routeCache.set(this.currentPage, this.routes);
            this.getTagNames();
          }
        ).catch(
        error => console.error(error)
      );
    }
  }

  deleteRoute(route: Route) {
    let context = this;
    this.deleteDialogRef = this.dialog.open(DeleteRouteDialogComponent);
    this.deleteDialogRef.componentInstance.route = route;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.routeService.deleteRoute(route.id)
            .then(
              response => {this.toasterService.pop('success', 'Success', route.title + ' - ' + this.translate('Route deleted'));
                setTimeout(function(){
                  context.reloadList();
                }, 1000); }
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
      }
    );
  }

  findRoutes() {
    if (this.searchQuery.trim().length > 0) {
      this.routes = undefined;
      this.routeCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    }
  }

  reloadList() {
    this.routes = undefined;
    this.routeCache.clear();
    this.getPage(1);
  }

  resetSearch() {
    this.searchQuery = '';
    this.routes = undefined;
    this.routeCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

}
