import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Tag } from '../shared/tag.model';

@Component({
    moduleId: module.id,
    selector: 'hip-delete-tag-dialog',
    templateUrl: 'delete-tag-dialog.component.html'
})
export class DeleteTagDialogComponent {
    tag: Tag;

    constructor(public dialogRef: MdDialogRef<DeleteTagDialogComponent>) { }
}
