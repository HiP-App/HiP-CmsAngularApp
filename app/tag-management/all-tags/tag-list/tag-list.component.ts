import { Component, Input } from '@angular/core';

import { AllTagsComponent } from '../all-tags.component';
import { Tag } from '../../tag.model';

@Component({
  selector: 'hip-tag-list',
  templateUrl: './app/tag-management/all-tags/tag-list/tag-list.component.html',
  styleUrls: ['./app/tag-management/all-tags/tag-list/tag-list.component.css']
})
export class TagListComponent {
  @Input() public tags: Tag[];
  @Input() public tagsEditable: boolean;

  constructor (private allTagsComponent: AllTagsComponent) {
  }

  public getChildren(tag: Tag): Tag[] {
    return this.allTagsComponent.getTagsById(tag.childId);
  }
}
