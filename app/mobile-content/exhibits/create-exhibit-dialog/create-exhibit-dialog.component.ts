import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Exhibit } from '../shared/exhibit.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-exhibit-dialog',
  styleUrls: ['create-exhibit-dialog.component.css'],
  templateUrl: 'create-exhibit-dialog.component.html'
})
export class CreateExhibitDialogComponent {
  exhibit = Exhibit.emptyExhibit();
  lat = 51.718990;
  lng =  8.754736;
  constructor(public dialogRef: MdDialogRef<CreateExhibitDialogComponent>) { }

  selectLocation(event: any) {
    this.exhibit.latitude = event.coords.lat;
    this.exhibit.longitude = event.coords.lng;
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
}
