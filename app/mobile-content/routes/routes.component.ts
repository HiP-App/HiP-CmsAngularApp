import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { Exhibit } from '../exhibits/shared/exhibit.model';
import { ExhibitService } from '../exhibits/shared/exhibit.service';
import { ConfigService } from '../../config.service';
import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateRouteDialogComponent } from './create-route-dialog/create-route-dialog.component';
import { Route } from './shared/route.model';
import { RouteService } from './shared/routes.service';
import { Status } from '../shared/status.model';
import { SupervisorGuard } from '../../shared/guards/supervisor-guard';
import { Tag } from '../tags/shared/tag.model';
import { TagService } from '../tags/shared/tag.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit, OnDestroy {
  routes: Route[];
  private routeCache = new Map<number, Route[]>();
  private routeExhibits = new Map<number, Exhibit[]>();
  private routeColor = new Map<number, string>();
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
  isSupervisor: boolean;
  inDeletedPage: boolean;

  // map parameters
  lat = parseFloat(this.config.get('defaultLatitude'));
  lng = parseFloat(this.config.get('defaultLongitude'));

  routeExhibitsLoaded = false;

  private createDialogRef: MdDialogRef<CreateRouteDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private changeDetector: ChangeDetectorRef,
              private dialog: MdDialog,
              private exhibitService: ExhibitService,
              private routeService: RouteService,
              public  router: Router,
              private toasterService: ToasterService,
              private tagService: TagService,
              private translateService: TranslateService,
              private supervisorGuard: SupervisorGuard,
              private config: ConfigService,
              private spinnerService: NgxSpinnerService) {
    if (router.url === '/mobile-content/routes/deleted') {this.inDeletedPage = true; } else {this.inDeletedPage = false; }
  }

  ngOnInit() {
    this.spinnerService.show();
    this.getIsSupervisor();
    this.getPage(1);
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  getIsSupervisor() {
    this.supervisorGuard.isSupervisor().then(
      (response: boolean) => {
        this.isSupervisor = response;
      });
  }

  createRoute() {
    let context = this;
    this.createDialogRef = this.dialog.open(CreateRouteDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
      (newRoute: Route) => {
        if (newRoute) {
          this.routeService.createRoute(newRoute)
            .then(
              response => {
                this.toasterService.pop('success', this.translate('route saved'));
                setTimeout(
                  function() {
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
    let tagArray = '';
    for (let i = 0; i < this.routes.length; i++ ) {
      for ( let j = 0; j < this.routes[i].tags.length; j++ ) {
        if (tagArray.indexOf(this.routes[i].tags[j]) === -1) {
          tagArray = tagArray + '&IncludeOnly=' + this.routes[i].tags[j] + '&';
        }
      }
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray).then(
      response => {
        this.existingTags = response.items;
        for (let i = 0; i < this.routes.length; i++ ) {
          for ( let j = 0; j < this.routes[i].tags.length; j++ ) {
            let index = this.existingTags.map(function(x: Tag) {return x.id; }).indexOf(this.routes[i].tags[j]);
            this.routes[i].tags[j] = this.existingTags[index].title;
          }
        }
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
      this.spinnerService.show();
      let status = this.inDeletedPage ? 'Deleted' : this.selectedStatus;
      this.routeService.getAllRoutes(page, this.routesPerPage, status , this.searchQuery )
        .then(
          data => {
            this.routes = data.items;
            this.totalItems = data.total;
            this.currentPage = page;
            this.routeCache.set(this.currentPage, this.routes);
            this.getTagNames();
            this.getRouteExhibits();
          }
        ).catch(
          error => {
            console.error(error);
            this.spinnerService.hide();
          }
        );
    }
  }

  getRouteExhibits() {
    this.routes.forEach(route => {
      let exhibits: Exhibit[] = [];
      route.exhibits.forEach(exhibitId => {
        this.exhibitService.getExhibit(exhibitId)
        .then(
          exhibit => {
            exhibits.push(exhibit);
          }
        );
      });
      this.routeColor.set(route.id, this.getRandomColor());
      this.routeExhibits.set(route.id, exhibits);
      this.spinnerService.hide();
    });
    this.routeExhibitsLoaded = true;
  }

  deleteRoute(route: Route) {
    let context = this;
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete route'),
        message: this.translateService.instant('confirm delete route', { name : route.title })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.routeService.deleteRoute(route.id)
            .then(
              () => {
                this.toasterService.pop('success', route.title + ' - ' + this.translate('route deleted'));
                setTimeout(
                  function() {
                    context.reloadList();
                  }, 1000);
              }
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
        }
      }
    );
  }

  findRoutes() {
    if (this.searchQuery.trim().length >= 3) {
      this.routes = undefined;
      this.routeCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    } else if (this.searchQuery.trim().length < 1) {
      this.resetSearch();
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

  getRandomColor() {
    return '#' + Math.floor(Math.random() * Math.pow(256, 3)).toString(16);
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
