import {Component, Inject, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Medium } from '../shared/medium.model';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-medium-dialog',
  styleUrls: ['edit-medium-dialog.component.css'],
  templateUrl: 'edit-medium-dialog.component.html'
})
export class EditMediumDialogComponent implements OnInit, AfterViewInit {
  medium: Medium;
  statusOptions = Status.getValues();

  @ViewChild('autosize') autosize: any ;

  constructor(public dialogRef: MdDialogRef<EditMediumDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: { medium: Medium }) {}

  ngOnInit() {
    // deep clone input medium object to make editing cancelable
    this.medium = JSON.parse(JSON.stringify(this.data.medium));
  }

  ngAfterViewInit() {
    let context = this;
    setTimeout(function(){ context.autosize.resizeToFitContent(); }, 200);
  }
}
