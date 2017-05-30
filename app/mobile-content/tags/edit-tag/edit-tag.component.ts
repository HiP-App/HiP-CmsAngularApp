import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Tag } from '../shared/tag.model';

@Component({
  moduleId: module.id,
  selector: 'hip-tags-edit-dialog',
  templateUrl: 'edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
  tag = Tag.getRandom();

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private activatedTag: ActivatedRoute,
              private dialog: MdDialog) {}

  ngOnInit() {
    this.tag.id = +this.activatedTag.snapshot.params['id'];
    // TODO: fetch exhibit from server by id
  }

  editTag(tag: Tag) {
    // TODO implement update tag
  }

  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          // TODO: handle selected medium
        }
      }
    );
  }

}
