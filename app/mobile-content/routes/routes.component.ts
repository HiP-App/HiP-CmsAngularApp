import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateRouteDialogComponent } from './create-route-dialog/create-route-dialog.component';
import { DeleteRouteDialogComponent } from './delete-route-dialog/delete-route-dialog.component';
import { Route } from './shared/route.model';
import { Status } from '../shared/status.model';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { RouteService } from './shared/routes.service';

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

    // search parameters
  searchQuery = '';
  selectedStatus = '';
  showingSearchResults = false;

  // pagination parameters
    routesPerPage = 10;
    currentPage = 1;
    totalItems: number;

  private createDialogRef: MdDialogRef<CreateRouteDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteRouteDialogComponent>;

    constructor(private dialog: MdDialog,
                private routeService: RouteService,
                private toasterService: ToasterService,
                private translateService: TranslateService) {}

  ngOnInit() {
      this.getPage(0);
  }

  createRoute() {
    this.createDialogRef = this.dialog.open(CreateRouteDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
          (newRoute: Route) => {
              if (newRoute) {
                  this.routeService.createRoute(newRoute)
                      .then(
                          response => this.toasterService.pop('success', this.translate('route saved'))
                      ).catch(
                      error => this.toasterService.pop('error', this.translate('Error while saving'), error)
                  );
              }
              this.createDialogRef = null;
          }
      );
  }
    getPage(page: number) {
        if (this.routeCache.has(page)) {
            this.routes = this.routeCache.get(page);
            this.currentPage = page;
        } else {
            this.routeService.getAllRoutes(page, this.routesPerPage)
                .then(
                    data => {
                        console.log(data);
                        this.routes = data.items;
                        this.totalItems = data.metadata.totalItems;
                        this.currentPage = page;
                        this.routeCache.set(this.currentPage, this.routes);
                    }
                ).catch(
                error => console.error(error)
            );
        }
    }

  deleteRoute(route: Route) {
    this.deleteDialogRef = this.dialog.open(DeleteRouteDialogComponent);
    this.deleteDialogRef.componentInstance.route = route;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
            this.toasterService.pop('success', 'Success', route.title + ' - ' + this.translate('Route deleted'));
            setTimeout(() => {
                this.reloadList();
            }, 1000);
        }
      }
    );
  }

  findRoutes() {
      if (this.searchQuery.trim().length > 0) {
          this.routes = undefined;
          this.routeCache.clear();
          this.getPage(0);
          this.showingSearchResults = true;
      }
  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
      this.searchQuery = '';
      this.routes = undefined;
      this.routeCache.clear();
      this.getPage(0);
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
