import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateRouteComponent } from './create-route/create-route.component';
import { RouteService } from './routes.service';
import { ToasterService } from 'angular2-toaster';
import { Route } from './route.model';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html',
  styleUrls: ['routes.component.css']
})
export class RoutesComponent implements OnInit {
  private translatedResponse: string;
  private dialogRef: MdDialogRef<CreateRouteComponent>;
    query = '';
    showingSearchResults = false;
    routes: Route[];
    totalRoutes: number;
    routesPerPage = 10;
    currentPage = 1;
    private routeCache = new Map<number, Route[]>();
  constructor(private dialog: MdDialog,
              private routeService: RouteService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}
  ngOnInit() {
      this.getPage(0);
  }
  createRoute() {
    this.dialogRef = this.dialog.open(CreateRouteComponent, { height: '21em', width: '50em' });
    this.dialogRef.afterClosed().subscribe(
        (newRoute: Route) => {
          if (newRoute) {
            this.routeService.createRoute(newRoute)
                .then(
                    response => this.toasterService.pop('success', this.translate('route saved'))
                ).catch(
                error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
          }
          this.dialogRef = null;
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
                    }
                ).catch(
                error => console.error(error)
            );
        }
    }
  editRoute() {
      return;
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
