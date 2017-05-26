import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Exhibit } from '../shared/exhibit.model';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-exhibit',
  styleUrls: ['edit-exhibit.component.css'],
  templateUrl: 'edit-exhibit.component.html'
})
export class EditExhibitComponent implements OnInit {
  exhibit = Exhibit.getRandom();
  id: number;
  statusOptions = Status.getValues();

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    // TODO: fetch exhibit from server by id
  }

  selectImage() {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%' });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          // TODO: handle selected medium
        }
      }
    );
  }
}
