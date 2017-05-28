import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Tag } from '../shared/tag.model';

@Component({
    moduleId: module.id,
    selector: 'hip-create-tag-dialog',
    templateUrl: 'create-tag-dialog.component.html'
})
export class CreateTagDialogComponent {
    tag = Tag.emptyTag();

    constructor(public dialogRef: MdDialogRef<CreateTagDialogComponent>) {}

}
