import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';
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
import { SelectExhibitDialogComponent } from '../select-exhibit-dialog/select-exhibit-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-edit-dialog',
  templateUrl: 'edit-route.component.html',
  styleUrls: ['edit-route.component.css']
})
export class EditRouteComponent implements OnInit {
  route = Route.emptyRoute();
  statusOptions = Status.getValues();
  @ViewChild('autosize') autosize: any;


  exhibits: Exhibit[] = [];
  searchedExhibits: Exhibit[] = [];
  showingExhibitSearchResults = false;
  private exhibitSearchQuery: string;
  private exhibitCache = new Map<number, Exhibit[]>();
  maxItems = 90;

  private tags: Array<object> = [];
  private audioName: string;
  private imageName: string;
  previewURL: SafeUrl;

  private selectExhibitDialogRef: MdDialogRef<SelectExhibitDialogComponent>;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;

  constructor(private routeService: RouteService,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
    private toasterService: ToasterService,
    private exhibitService: ExhibitService,
    private translateService: TranslateService,
    private tagService: TagService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MdDialog,
    private mapsAPILoader: MapsAPILoader) { }

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
          setTimeout(function () { context.autosize.resizeToFitContent(); }, 200);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching topic'), error);
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
            this.router.navigate(['/mobile-content/routes']);
          }, 500);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
        }
      );
  }

  moveExhibitDown(exhibit: number) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if (index < this.route.exhibits.length - 1) {
      this.swapExhibits(index, index + 1);
    }
  }

  previewImage(id: number) {
    // preview image
    this.mediaService.downloadFile(id, true)
      .then(
        (response: any) => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            base64Data = reader.result;
            this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          };
        }
      );
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
    this.calculateDistanceandTime();
  }

  removeExhibit(exhibit: Exhibit) {
    this.route.exhibits = this.route.exhibits.filter(
      function (item) {
        return item !== exhibit.id;
      }
    );
    this.exhibits = this.exhibits.filter(
      function (item) {
        return item.id !== exhibit.id;
      }
    );
    this.calculateDistanceandTime();
  }

  selectedExhibit(exhibit: Exhibit) {
    if (this.route.exhibits.indexOf(exhibit.id) === -1) {
      this.exhibits.push(exhibit);
      this.route.exhibits.push(exhibit.id);
      this.calculateDistanceandTime();
    }
  }

  calculateDistanceandTime() {
    let context = this;
    if (this.exhibits.length > 1) {
      this.mapsAPILoader.load().then(() => {
        let origin = new google.maps.LatLng(parseFloat(this.exhibits[0].latitude), parseFloat(this.exhibits[0].longitude));
        let destination = new google.maps.LatLng(
          parseFloat(this.exhibits[this.exhibits.length - 1].latitude),
          parseFloat(this.exhibits[this.exhibits.length - 1].longitude));
        let stops = [];
        for (let i = 1; i < this.exhibits.length - 1; i++) {
          stops.push({
            location: new google.maps.LatLng(parseFloat(this.exhibits[i].latitude), parseFloat(this.exhibits[i].longitude)),
            stopover: false
          });
        }
        let service = new google.maps.DirectionsService();
        service.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.METRIC,
            waypoints: stops
          }, callback);

        function callback(response, status) {
          if (status === 'OK') {
            context.route.duration = Math.round(response.routes[0].legs[0].duration.value / 60);
            context.route.distance = (response.routes[0].legs[0].distance.value / 1000);
          }
        }
      });
    }
  }

  updateData() {
    let temparr = [];
    for (let i = 0; i < this.tags.length; i++) {
      temparr.push(this.tags[i]['value']);
    }
    this.route.tags = temparr;
  }

  getTagNames() {
    let tagArray = '';
    for (let i = 0; i < this.route.tags.length; i++) {
      tagArray = tagArray + '&IncludeOnly=' + this.route.tags[i] + '&';
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray)
      .then(
        response => {
          for (let tag of this.route.tags) {
            let index = response.items.map(function (x: Tag) { return x.id; }).indexOf(tag);
            let tagElement = { display: response.items[index].title, value: tag };
            this.tags.push(tagElement);
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
            this.toasterService.pop('error', this.getTranslatedString('Error media name'), error);
            this.router.navigate(['/error']);
          }
        );
    } else {
      this.audioName = this.getTranslatedString('no audio selected');
    }
    if (this.route.image) {
      this.mediaService.getMediaById(this.route.image)
        .then(
          (response: Route) => {
            this.imageName = response.title;
            this.previewImage(response.id);
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error media name'), error);
            this.router.navigate(['/error']);
          }
        );
    } else {
      this.imageName = this.getTranslatedString('no image selected');
    }
  }

  getExhibitNames() {
    if (this.route.exhibits) {
      this.exhibitService.getAllExhibits(1, 100, 'All', '', 'id', '', this.route.exhibits)
        .then(
          response => {
            if (response.items) {
              // Order the Exhibits before displaying
              this.exhibits = [];
              for (let exhibit of this.route.exhibits) {
                let index = response.items.map(function (x: Exhibit) { return x.id; }).indexOf(exhibit);
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
            let tagElement = { display: tag.title, value: tag.id };
            returnData.push(tagElement);
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
    this.previewURL = null;
  }

  findExhibits() {
    if (this.exhibitSearchQuery.trim().length > 0) {
      this.searchedExhibits = undefined;
      this.exhibitCache.clear();
      this.showingExhibitSearchResults = true;
      if (this.exhibitCache.has(1)) {
        this.searchedExhibits = this.exhibitCache.get(1);
      } else {
        this.exhibitService.getAllExhibits(1, 50, 'Published', this.exhibitSearchQuery)
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
          if (selectedMedium.isImage()) {
            this.route.image = selectedMedium.id;
            this.imageName = selectedMedium.title;
            this.previewImage(this.route.image);
          }
          if (selectedMedium.isAudio()) {
            this.route.audio = selectedMedium.id;
            this.audioName = selectedMedium.title;
          }
        }
      }
    );
  }

  addExhibit() {
    this.selectExhibitDialogRef = this.dialog.open(SelectExhibitDialogComponent, { width: '400px' });
    this.selectExhibitDialogRef.afterClosed().subscribe(
      (exhibit: Exhibit) => {
        if (exhibit) {
          this.route.exhibits.push(exhibit.id);
          this.getExhibitNames();
        }
      }
    );
  }

  openHistory() {
    let context = this;
    this.routeService.getHistory(this.route.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, {
            width: '60%',
            data: {
              title: context.route.title,
              data: response
            }
          });
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching history'), error);
        }
      );
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', this.route.title + ' - ' + this.getTranslatedString('route updated'));
  }
}
