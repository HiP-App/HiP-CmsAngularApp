import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Tag } from '../../tag.model';
import { TagService } from '../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-input',
  styleUrls: ['tag-input.component.css'],
  templateUrl: 'tag-input.component.html'
})
export class TagInputComponent implements OnInit {
  @Input() tag: Tag;
  @Output() onUpdate = new EventEmitter<Tag>();
  layers = Tag.layers;
  private tagBackup = Tag.emptyTag();

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.backupTag();
  }

  updateTag(tag: Tag) {
    if (tag) {
      this.backupTag();
    } else {
      // revert changes
      for (let prop in this.tag) {
        if (this.tag.hasOwnProperty(prop)) {
          this.tag[prop] = this.tagBackup[prop];
        }
      }
    }
    this.onUpdate.emit(tag);
  }

  /** 
   * Saves a deep copy of the tag bound to the form.
   * The backup is used to revert changes if user cancels.
   */
  private backupTag() {
    for (let prop in this.tag) {
      if (this.tag.hasOwnProperty(prop)) {
        this.tagBackup[prop] = this.tag[prop];
      }
    }
  }
}
