import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Exhibit } from '../shared/exhibit.model';


@Component({
  moduleId: module.id,
  selector: 'hip-delete-exhibit-dialog',
  templateUrl: 'delete-exhibit-dialog.component.html'
})
export class DeleteExhibitDialogComponent {
  exhibit: Exhibit;
  constructor(public dialogRef: MdDialogRef<DeleteExhibitDialogComponent>) { }
}
