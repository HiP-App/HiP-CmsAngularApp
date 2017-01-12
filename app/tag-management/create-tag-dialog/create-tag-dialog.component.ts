import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Tag } from '../tag.model';

@Component({
  moduleId: module.id,
  selector: 'hip-create-tag-dialog',
  templateUrl: 'create-tag-dialog.component.html',
  styleUrls: ['create-tag-dialog.component.css']
})
export class CreateTagDialogComponent {
  layers: string[] = Tag.layers;
  parentTag: Tag = Tag.emptyTag();
  tag: Tag = Tag.emptyTag();

  constructor(public dialogRef: MdDialogRef<CreateTagDialogComponent>) {
    this.tag.layer = this.layers[0];
    this.tag.childId = [];
  }
}
