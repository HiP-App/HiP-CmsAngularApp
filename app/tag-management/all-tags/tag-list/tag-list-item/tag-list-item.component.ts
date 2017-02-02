import { Component, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateTagDialogComponent } from '../../../create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from '../../../delete-tag-dialog/delete-tag-dialog.component';
import { Tag } from '../../../tag.model';
import { TagService } from '../../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-list-item',
  templateUrl: 'tag-list-item.component.html',
  styleUrls: ['tag-list-item.component.css']
})
export class TagListItemComponent {
  @Input() tag: Tag;
  @Input() editable: boolean;

  showEditor = false;
  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteTagDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  addSubtag() {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, {height: '25em', width: '50em'});
    this.createDialogRef.componentInstance.parentTag = this.tag;
    this.createDialogRef.componentInstance.tag.layer = this.tag.layer;
    this.createDialogRef.componentInstance.tag.parentId = this.tag.id;
    this.createDialogRef.afterClosed().subscribe(
      (newSubtag: Tag) => {
        if (newSubtag) {
          this.tagService.createTag(newSubtag)
            .then(
              (newTagId: number) => this.tagService.setChildTag(this.tag.id, newTagId)
            ).then(
            response => this.toasterService.pop('success', newSubtag.name + ' ' + this.translate('added as subtag'))
          ).catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          );
        }
        this.createDialogRef = null;
      }
    );
  }

  deleteTag() {
    this.deleteDialogRef = this.dialog.open(DeleteTagDialogComponent, {height: '14.5em'});
    this.deleteDialogRef.componentInstance.tagName = this.tag.name;
    this.deleteDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.tagService.deleteTag(this.tag.id)
            .then(
              response => this.toasterService.pop('success', this.translate('tag deleted'))
            ).catch(
            error => this.toasterService.pop('error', this.translate('Error while deleting'), error)
          );
        }
        this.deleteDialogRef = null;
      }
    );
  }

  getSubtags(parentTag: Tag): Tag[] {
    return this.tagService.getFromCache(parentTag.childId).sort(Tag.tagAlphaCompare);
  }

  toggleEditor() {
    this.showEditor = !this.showEditor;
  }

  onEditorClosed(tag: Tag) {
    this.showEditor = false;
    this.tag = tag;
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }
}
