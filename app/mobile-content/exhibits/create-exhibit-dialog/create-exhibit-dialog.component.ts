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
  exhibit = new Exhibit('Name');

  constructor(public dialogRef: MdDialogRef<CreateExhibitDialogComponent>) { }
}
