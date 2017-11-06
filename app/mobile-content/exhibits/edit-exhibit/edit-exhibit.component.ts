import { } from 'googlemaps';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, NgZone, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Rx';

import { CreateTagDialogComponent } from '../../tags/create-tag-dialog/create-tag-dialog.component';
import { Exhibit } from '../shared/exhibit.model';
import { ExhibitService } from '../shared/exhibit.service';
import { MediaService } from '../../media/shared/media.service';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { Tag } from '../../tags/shared/tag.model';
import { TagService } from '../../tags/shared/tag.service';
import { UploadMediumDialogComponent } from '../../media/upload-medium-dialog/upload-medium-dialog.component';
import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-exhibit',
  styleUrls: ['edit-exhibit.component.css'],
  templateUrl: 'edit-exhibit.component.html'
})
export class EditExhibitComponent implements OnInit {
  id: number;
  exhibit = Exhibit.emptyExhibit();
  statusOptions = Status.getValues();
  private tags: Array<object> = [];
  private audioName: string;
  private imageName: string;
  public searchControl: FormControl;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;
  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;

  @ViewChild('autosize') autosize: any ;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  previewURL: SafeUrl;
  lat = 51.718990;
  lng =  8.754736;

  constructor(private exhibitService: ExhibitService,
              private mediumService: MediaService,
              private sanitizer: DomSanitizer,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router,
              private activatedExhibit: ActivatedRoute,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private dialog: MdDialog) {}

  ngOnInit() {
    let context = this;
    this.id = +this.activatedExhibit.snapshot.params['id'];
    this.exhibitService.getExhibit(this.id)
      .then(
        (response: Exhibit) => {
          this.exhibit = response;
          this.getMediaName();
          this.getTagNames();
          this.updateMap();
          setTimeout(function(){ context.autosize.resizeToFitContent(); }, 250);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching exhibit') , error);
        }
    );
    this.initMapAutocomplete();
  }

  initMapAutocomplete() {
    let context = this;
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
            context.lat = place.geometry.location.lat();
            context.lng = place.geometry.location.lng();
        });
      });
    });

  }

  editExhibit(exhibit: Exhibit) {
    if (this.exhibit.latitude) {
      this.exhibit.latitude = this.exhibit.latitude.toString().replace(/,/g, '.');
    }
    if (this.exhibit.longitude) {
      this.exhibit.longitude = this.exhibit.longitude.toString().replace(/,/g, '.');
    }
    this.exhibitService.updateExhibit(this.exhibit)
      .then(
        () => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/mobile-content/exhibits']);
          }, 500);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
        }
      );
  }

  updateData() {
    let temparr = [];
    for (let i = 0; i < this.tags.length; i++ ) {
      temparr.push(this.tags[i]['value']);
    }
    this.exhibit.tags = temparr;
  }

  addMedia() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, {width: '35em'});
    this.uploadDialogRef.afterClosed().subscribe(
      (obj: any) => {
        if (!obj) { return; }

        let newMedium = obj.media;
        let file: File = obj.file;
        if (!newMedium) { return; }

        this.mediumService.postMedia(newMedium)
          .then(
            (res: any) => {
              if (file) {
                return this.mediumService.uploadFile(res, file);
              }
            }
          ).then(
            () => this.toasterService.pop('success', this.translate('media saved'))
          ).catch(
            err => this.toasterService.pop('error', this.translate('Error while saving'), err)
          );
      }
    );
  }

  addTag() {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, {width: '45em'});
    this.createDialogRef.afterClosed().subscribe(
      (newTag: Tag) => {
        if (newTag) {
          this.tagService.createTag(newTag)
            .then(
              response => {
                this.toasterService.pop('success', this.translate('tag saved'));
              }
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  getMediaName() {
    if (!this.exhibit.image) {
      this.imageName = this.getTranslatedString('no image selected');
    } else {
      this.mediumService.getMediaById(this.exhibit.image)
        .then(
          response => {
            this.imageName = response.title;
            this.previewImage(response.id);
          }
        ).catch(
          error => this.toasterService.pop('error', this.translate('Error fetching image'), error)
        );

    }
  }

  previewImage(id: number) {
    // preview image
    this.mediumService.downloadFile(id, true)
      .then(
        response => {
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


  getTagNames() {
    let tagArray = '';
    for (let i = 0; i < this.exhibit.tags.length; i++ ) {
      tagArray = tagArray + '&IncludeOnly=' + this.exhibit.tags[i] + '&';
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray).then(
      response => {
        for (let tag of this.exhibit.tags)
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

  requestAutoCompleteItems = (search: string): Observable<Array<object>> => {
    return Observable.fromPromise(this.tagService.getAllTags(1, 50, 'PUBLISHED', search)
      .then(
        data => {
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
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  selectLocation(event: any) {
    this.exhibit.latitude = event.coords.lat;
    this.exhibit.longitude = event.coords.lng;
  }

  selectImage() {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: 'Image' } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          this.exhibit.image = selectedMedium.id;
          this.imageName = selectedMedium.title;
          this.previewImage(this.exhibit.image);
        }
      }
    );
  }

  removeImage() {
    this.exhibit.image = null;
    this.previewURL = null;
    this.getMediaName();
  }

  updateMap() {
    if (this.exhibit.latitude) {
      this.lat = +this.exhibit.latitude;
    }
    if (this.exhibit.longitude) {
      this.lng = +this.exhibit.longitude;
    }
  }

  openHistory() {
    let context = this;
    this.exhibitService.getHistory(this.exhibit.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, { width: '60%',
            data: {
              title: context.exhibit.name,
              data: response
            }
          });
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.getTranslatedString('Error fetching history') , error);
      }
    );
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.exhibit.name + ' - ' + this.getTranslatedString('exhibit updated'));
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
