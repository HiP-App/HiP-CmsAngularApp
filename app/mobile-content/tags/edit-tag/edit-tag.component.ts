import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tag } from '../shared/tag.model';

@Component({
    moduleId: module.id,
    selector: 'hip-tags-edit-dialog',
    templateUrl: 'edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
    tag = Tag.getRandom();

    constructor(private activatedTag: ActivatedRoute) {}

    ngOnInit() {
        let id = +this.activatedTag.snapshot.params['id'];
        // TODO: fetch exhibit from server by id
    }

    editTag(tag: Tag) {
        // TODO implement update tag
    }

}
