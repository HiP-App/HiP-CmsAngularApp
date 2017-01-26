import { OnInit, Component, Output, EventEmitter, Input } from '@angular/core';
import { Tag } from '../../../tag.model';
import { TagService } from '../../../tag.service';
@Component({
  moduleId: module.id,
  selector: 'hip-tag-menu-item',
  templateUrl: 'tag-menu-item.component.html',
  styleUrls: ['tag-menu-item.component.css']
})
export class TagMenuItemComponent implements OnInit {

  @Input() tag = Tag.emptyTag();
  @Input() selectedTagId = -1;
  @Output() onTagClicked = new EventEmitter<Tag>();
  @Output() onVisibilityClicked = new EventEmitter<Tag>();
  subTags: Tag[] = [];
  showChildren = false;

  constructor(private tagService: TagService) {}

  ngOnInit() {
    if (this.tag.id !== -1) {
      this.tagService.getChildTags(this.tag.id)
        .then(
          (tags: Tag[]) => this.subTags = tags
        ).catch();
    }
  }

  emitOnTagClicked(tag: Tag) {
    this.onTagClicked.emit(tag);
  }

  emitOnVisibilityClicked(tag: Tag) {
    this.onVisibilityClicked.emit(tag);
  }

  /**
   * Highlights currently selected button with corresponding tag's style.
   * Returns a collection of styles consumed by ngStyle directive.
   */
  highlightButton(tag: Tag) {
    return {
      'background-color': this.selectedTagId === tag.id ? tag.style : 'initial',
    };
  }

  toggleShowChildren() {
    this.showChildren = !this.showChildren;
  }
}
