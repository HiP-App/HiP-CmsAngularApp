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
  constructor(private dialog: MdDialog,
              private routeService: RouteService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}
  ngOnInit() {
    // TODO fetch data using your RouteService.
  }
  createRoute() {
    this.dialogRef = this.dialog.open(CreateRouteComponent, { height: '20em', width: '50em' });
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
