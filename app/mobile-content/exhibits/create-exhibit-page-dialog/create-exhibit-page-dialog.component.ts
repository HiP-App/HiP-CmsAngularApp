import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ExhibitPage } from '../shared/exhibit-page.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-exhibit-page-dialog',
  templateUrl: 'create-exhibit-page-dialog.component.html'
})
export class CreateExhibitPageDialogComponent {
  page = new ExhibitPage();

  constructor(public dialogRef: MdDialogRef<CreateExhibitPageDialogComponent>) {}
}
