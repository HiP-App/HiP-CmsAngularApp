import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Rx';

import { Exhibit } from '../shared/exhibit.model';
import { ExhibitService } from '../shared/exhibit.service';
import { MediaService } from '../../media/shared/media.service';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { Tag } from '../../tags/shared/tag.model';
import { TagService } from '../../tags/shared/tag.service';

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
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  @ViewChild('autosize') autosize: any ;
  acceptedTypes = '';
  medium = new Medium();
  types = Medium.types;
  file: File;

  constructor(private exhibitService: ExhibitService,
              private mediumService: MediaService,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router,
              private activatedExhibit: ActivatedRoute,
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
          setTimeout(function(){ context.autosize.resizeToFitContent(); }, 250);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching exhibit') , error);
        }
    );
  }

  editExhibit(exhibit: Exhibit) {
    if (this.exhibit.latitude) {this.exhibit.latitude = this.exhibit.latitude.toString().replace(/,/g, '.'); }
    if (this.exhibit.longitude) {this.exhibit.longitude = this.exhibit.longitude.toString().replace(/,/g, '.'); }
    this.exhibitService.updateExhibit(this.exhibit)
      .then(
        () => {
          this.handleResponseUpdate();
          setTimeout(() => {
            this.router.navigate(['/exhibits/']);
          }, 500);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while saving') , error);
        }
      );
  }

  private handleResponseUpdate() {
    this.toasterService.pop('success', 'Success', this.exhibit.name + ' - ' + this.getTranslatedString('exhibit updated'));
  }

  updateData() {
    let temparr = [];
    for (let i = 0; i < this.tags.length; i++ ) {
      temparr.push(this.tags[i]['value']);
    }
    this.exhibit.tags = temparr;
  }

  private setAcceptedTypes() {
    switch (this.medium.type) {
      case 'Audio':
        this.acceptedTypes = '.mp3';
        break;

      case 'Image':
        this.acceptedTypes = '.jpg,.jpeg,.png';
        break;

      default:
        this.acceptedTypes = '';
    }
  }

  public fileSet(event: any) {
    this.file = event.target.files[0];
  }

  getMediaName() {
    if (!this.exhibit.image) {
      this.imageName = this.getTranslatedString('no image selected');
    } else {
      this.mediumService.getMediaById(this.exhibit.image)
        .then(
          (response: any) => this.imageName = response.title
        ).catch(
          (error: any) => this.toasterService.pop('error', this.translate('Error fetching image'), error)
        );
    }
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
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  selectImage() {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: 'Image' } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          this.exhibit.image = selectedMedium.id;
          this.imageName = selectedMedium.title;
        }
      }
    );
  }

  removeImage() {
    this.exhibit.image = null;
    this.getMediaName();
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
