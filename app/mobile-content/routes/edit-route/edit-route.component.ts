import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {RouteService} from '../shared/routes.service';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Route } from '../shared/route.model';
import { Status } from '../../shared/status.model';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-edit-dialog',
  templateUrl: 'edit-route.component.html',
  styleUrls: ['edit-route.component.css']
})
export class EditRouteComponent implements OnInit {
  route = Route.getRandom();
  translatedResponse: any;
  statusOptions = Status.getValues();

  constructor(private activatedRoute: ActivatedRoute,
              private routeService: RouteService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router) {}

  ngOnInit() {
    let id = +this.activatedRoute.snapshot.params['id'];
    this.routeService.getRoute(id)
        .then(
            (response: Route) => {
              this.route = response;
            }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching topic') , error);
          this.router.navigate(['/error']);
        }
    );
  }

  editRoute(route: Route) {
    this.routeService.updateRoute(this.route)
        .then(
            (response: any) => this.handleResponseUpdate()
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
        }
    );
  }

  moveExhibitDown(exhibit: Exhibit) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if (index < this.route.exhibits.length - 1) {
      this.swapExhibits(index, index + 1);
    }
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.route.title + ' - ' + this.getTranslatedString('Topic updated'));
    setTimeout(() => {
      this.router.navigate(['/routes', this.route.id]);
    }, 100);
  }

  moveExhibitUp(exhibit: Exhibit) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if ( index > 0) {
      this.swapExhibits(index, index - 1);
    }
  }

  private swapExhibits(index1: number, index2: number) {
    let temp = this.route.exhibits[index1];
    this.route.exhibits[index1] = this.route.exhibits[index2];
    this.route.exhibits[index2] = temp;
  }

  removeExhibit(exhibit: Exhibit) {
    this.route.exhibits = this.route.exhibits.filter(
      function (item) {
        return item.id !== exhibit.id;
      }
    );
  }
  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
        (value: any) => {
          this.translatedResponse = value;
        }
    );
    return this.translatedResponse;
  }
}
