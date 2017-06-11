import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {RouteService} from '../shared/routes.service';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Tag } from '../../tags/shared/tag.model';
import { Route } from '../shared/route.model';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-edit-dialog',
  templateUrl: 'edit-route.component.html',
  styleUrls: ['edit-route.component.css']
})
export class EditRouteComponent implements OnInit {
  route = Route.emptyRoute();
  translatedResponse: any;
  statusOptions = Status.getValues();
  maxItems = 90;
  private tags: Array<object> = [];
  private audioName: string;
  private imageName: string;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
    constructor(
              private routeService: RouteService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MdDialog) {}

  ngOnInit() {
    let id = +this.activatedRoute.snapshot.params['id'];
    this.routeService.getRoute(id)
        .then(
            (response: Route) => {
              this.route = response;
              this.getTagNames();
              this.getMediaNames();
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
      this.router.navigate(['/routes/edit/', this.route.id]);
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
  updateData() {
      let temparr = [];
      for (let i = 0; i < this.tags.length; i++ ) {
          temparr.push(this.tags[i]['value']);
      }
      this.route.tags = temparr;
  }
  getTagNames() {
      for (let tag of this.route.tags)
      {
          let tagElement = {display: 'tag', value: tag};
          this.tags.push( tagElement );
      }
  }
    getMediaNames() {
        this.imageName = 'Img.jpg';
        this.audioName = 'audio.mp3';
    }
  requestAutoCompleteItems = (search: string): Observable<Array<object>> => {
    return Observable.fromPromise(this.routeService.getAllRoutes(1, 100, 'ALL', search)
        .then(
            (data) => {
              let tags = data.items;
              let returnData = [];
              for (let tag of tags) {
                let tagElement = {display: tag.title, value: tag.id};
                returnData.push( tagElement );
              }
              return returnData;
            }
        ));
  }
  getTranslatedString(data: any) {
      this.translateService.get(data).subscribe(
          (value: any) => {
              this.translatedResponse = value;
          }
      );
      return this.translatedResponse;
  }
  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          if (selectedMedium.type === 'image' ) {
              this.route.image = selectedMedium.id;
              this.imageName = selectedMedium.title;
          }
           if (selectedMedium.type === 'audio' ) {
               this.route.audio = selectedMedium.id;
               this.audioName = selectedMedium.title;
          }
        }
      }
    );
  }
}
