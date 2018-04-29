import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../../tag.model';
import { TagService } from '../../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-input',
  styleUrls: ['tag-input.component.css'],
  templateUrl: 'tag-input.component.html'
})
export class TagInputComponent implements OnInit {
  @Input() tag: Tag;
  @Output() onExit = new EventEmitter<Tag>();
  layers = Tag.layers;
  private tagBackup = Tag.emptyTag();
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.backupTag();
  }

  updateTag() {
    this.tagService.updateTag(this.tagBackup)
      .then(
        response => this.onExit.emit(this.tagBackup)
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error while saving'), error)
    );
  }

  exit() {
    this.onExit.emit(this.tag);
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
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
