import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ContentStatus } from '../../shared/content-status.model';
import { Medium } from '../medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-medium-dialog',
  styleUrls: ['edit-medium-dialog.component.css'],
  templateUrl: 'edit-medium-dialog.component.html'
})
export class EditMediumDialogComponent implements OnInit {
  medium: Medium;
  statusOptions = ContentStatus.values;

  constructor(public dialogRef: MdDialogRef<EditMediumDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { medium: Medium }) {}

  ngOnInit() {
    // deep clone input medium object to make editing cancelable
    this.medium = JSON.parse(JSON.stringify(this.data.medium));
  }
}
