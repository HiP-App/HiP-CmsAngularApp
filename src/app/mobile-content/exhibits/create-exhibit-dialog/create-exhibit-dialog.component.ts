import { } from 'googlemaps';
import { Component, ElementRef, OnInit, NgZone, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ConfigService } from '../../../config.service';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Exhibit } from '../shared/exhibit.model';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-exhibit-dialog',
  styleUrls: ['create-exhibit-dialog.component.css'],
  templateUrl: 'create-exhibit-dialog.component.html'
})
export class CreateExhibitDialogComponent implements OnInit {
  exhibit = Exhibit.emptyExhibit();
  lat = parseFloat(this.config.get('defaultLatitude'));
  lng = parseFloat(this.config.get('defaultLongitude'));
  statusOptions = Status.getValues();
  public searchControl: FormControl;
  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor (@Inject(MD_DIALOG_DATA) public data: any,
               public dialogRef: MdDialogRef<CreateExhibitDialogComponent>,
               private mapsAPILoader: MapsAPILoader,
               private ngZone: NgZone,
               private config: ConfigService
              ) { }

  ngOnInit() {
    this.exhibit.latitude = this.data.lat;
    this.exhibit.longitude = this.data.lng;
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

  selectLocation(event: any) {
    this.exhibit.latitude = event.coords.lat;
    this.exhibit.longitude = event.coords.lng;
  }

  updateMap() {
    this.lat = +this.exhibit.latitude;
    this.lng = +this.exhibit.longitude;
  }
}
