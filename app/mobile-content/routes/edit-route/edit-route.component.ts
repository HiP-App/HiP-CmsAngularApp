import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';
import { Medium } from '../../media/shared/medium.model';
import { MediaService } from '../../media/shared/media.service';
import { Route } from '../shared/route.model';
import { RouteService } from '../shared/routes.service';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { Tag } from '../../tags/shared/tag.model';
import { TagService } from '../../tags/shared/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-edit-dialog',
  templateUrl: 'edit-route.component.html',
  styleUrls: ['edit-route.component.css']
})
export class EditRouteComponent implements OnInit{
  route = Route.emptyRoute();
  statusOptions = Status.getValues();
  @ViewChild('autosize') autosize: any ;


  exhibits: Exhibit[] = [];
  searchedExhibits: Exhibit[] = [];
  showingExhibitSearchResults = false;
  private exhibitSearchQuery: string;
  private exhibitCache = new Map<number, Exhibit[]>();
  maxItems = 90;

  private tags: Array<object> = [];
  private audioName: string;
  private imageName: string;

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private routeService: RouteService,
              private mediaService: MediaService,
              private toasterService: ToasterService,
              private exhibitService: ExhibitService,
              private translateService: TranslateService,
              private tagService: TagService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MdDialog) {}

  ngOnInit() {
    let id = +this.activatedRoute.snapshot.params['id'];
    let context = this;
    this.routeService.getRoute(id)
      .then(
        (response: Route) => {
          this.route = response;
          this.getTagNames();
          this.getMediaNames();
          this.getExhibitNames();
          setTimeout(function(){ context.autosize.resizeToFitContent(); }, 200);
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
        () => {
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

  moveExhibitDown(exhibit: number) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if (index < this.route.exhibits.length - 1) {
      this.swapExhibits(index, index + 1);
    }
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', this.route.title + ' - ' + this.getTranslatedString('route updated'));
  }

  moveExhibitUp(exhibit: number) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if (index > 0) {
      this.swapExhibits(index, index - 1);
    }
  }

  private swapExhibits(index1: number, index2: number) {
    let temp = this.route.exhibits[index1];
    let tempObject = this.exhibits[index1];
    this.route.exhibits[index1] = this.route.exhibits[index2];
    this.exhibits[index1] = this.exhibits[index2];
    this.exhibits[index1] = this.exhibits[index2];
    this.route.exhibits[index2] = temp;
    this.exhibits[index2] = tempObject;
  }

  removeExhibit(exhibit: Exhibit) {
    this.route.exhibits = this.route.exhibits.filter(
      function (item) {
        return item !== exhibit.id;
      }
    );
    this.exhibits = this.exhibits.filter(
      function(item) {
        return item.id !== exhibit.id;
      }
    );
  }

  selectedExhibit(exhibit: Exhibit) {
    if (this.route.exhibits.indexOf(exhibit.id) === -1) {
      this.exhibits.push(exhibit);
      this.route.exhibits.push(exhibit.id);
    }
  }

  updateData() {
    let temparr = [];
    for (let i = 0; i < this.tags.length; i++ ) {
      temparr.push(this.tags[i]['value']);
    }
    this.route.tags = temparr;
  }

  getTagNames() {
    let tagArray = '';
    for (let i = 0; i < this.route.tags.length; i++ ) {
      tagArray = tagArray + '&IncludeOnly=' + this.route.tags[i] + '&';
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray)
      .then(
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
      this.audioName =  this.getTranslatedString('no audio selected');
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
      this.imageName =  this.getTranslatedString('no image selected');
    }
  }

  getExhibitNames() {
    if (this.route.exhibits) {
      let exhibitArray = '';
      for (let i = 0; i < this.route.exhibits.length; i++) {
        exhibitArray = exhibitArray + '&IncludeOnly=' + this.route.exhibits[i] + '&';
      }
      this.exhibitService.getAllExhibits(1, 100, 'All', '', 'id', exhibitArray)
        .then(
          response => {
            if (response.items) {
              // Order the Exhibits before displaying
              for (let exhibit of this.route.exhibits) {
                let index = response.items.map(function (x: Exhibit) {return x.id; }).indexOf( exhibit );
                this.exhibits.push(response.items[index]);
              }
            }
          }
        ).catch(
          error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
        );
    }
  }

  requestAutoCompleteItems = (search: string): Observable<Array<object>> => {
    return Observable.fromPromise(this.tagService.getAllTags(1, 50, 'PUBLISHED', search)
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
      )
    );
  }

  getTranslatedString(data: any) {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: any) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  removeMedia(type: string) {
    if (type === 'Audio') {
      this.route.audio = null;
    } else if (type === 'Image') {
      this.route.image = null;
    }
    this.getMediaNames();
  }

  findExhibits() {
    if (this.exhibitSearchQuery.trim().length > 0) {
      this.searchedExhibits = undefined;
      this.exhibitCache.clear();
      this.showingExhibitSearchResults = true;
      if (this.exhibitCache.has(1)) {
        this.searchedExhibits = this.exhibitCache.get(1);
      } else {
        this.exhibitService.getAllExhibits(1, 50, 'Published', this.exhibitSearchQuery )
          .then(
            data => {
              this.searchedExhibits = data.items;
              this.exhibitCache.set(1, this.searchedExhibits);
            }
          ).catch(
            error => console.error(error)
          );
      }
    }
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
