import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';
import { FormControl } from '@angular/forms';

import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Tag } from '../../tags/shared/tag.model';
import { Route } from '../shared/route.model';
import { Medium } from '../../media/shared/medium.model';
import { MediaService } from '../../media/shared/media.service';
import { RouteService } from '../shared/routes.service';
import { TagService } from '../../tags/shared/tag.service';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { ToasterService } from 'angular2-toaster';

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
  private exhibitSearchquery: string;
  private imageName: string;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  options = [
    'Mary',
   'Shelley',
   'Igor'
  ];

  constructor(private routeService: RouteService,
              private mediaService: MediaService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private tagService: TagService,
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
        (response: any) => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/routes']);
          }, 500);
        }
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
    let tagArray = '?';
    for (let i = 0; i < this.route.tags.length; i++ ) {
          tagArray = tagArray + 'IncludeOnly=' + this.route.tags[i] + '&';
    }
    this.routeService.getTagNames(tagArray).then(
      response => {
        for (let tag of this.route.tags)
        {
          let index = response.items.map(function(x: Tag) {return x.id; }).indexOf(tag);
          let tagElement = {display: response.items[index].title, value: tag};
          this.tags.push( tagElement );
        }
      }
    ).catch(
      error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
    );
  }

  getMediaNames() {
    if (this.route.audio) {
      this.mediaService.getMediaById(this.route.audio)
        .then(
          (response: Route) => {
            this.audioName = response.title;
          }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error media name') , error);
          this.router.navigate(['/error']);
        }
      );
    } else {
      this.audioName =  this.getTranslatedString('No audio selected');
    }
    if (this.route.image) {
      this.mediaService.getMediaById(this.route.image)
        .then(
          (response: Route) => {
            this.imageName = response.title;
          }
        ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error media name') , error);
          this.router.navigate(['/error']);
        }
      );
    } else {
      this.imageName =  this.getTranslatedString('No image selected');
    }
  }

  requestAutoCompleteItems = (search: string): Observable<Array<object>> => {
    return Observable.fromPromise(this.tagService.getAllTags(1, 100, 'ALL', search)
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

  removeMedia(type: string) {
    if (type === 'audio') {
      this.route.audio = null;
    }else {
      this.route.image = null;
    }
    this.getMediaNames();
  }

  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          if (selectedMedium.type === 'Image' ) {
            this.route.image = selectedMedium.id;
            this.imageName = selectedMedium.title;
          }
          if (selectedMedium.type === 'Audio' ) {
            this.route.audio = selectedMedium.id;
            this.audioName = selectedMedium.title;
          }
        }
      }
    );
  }
}
