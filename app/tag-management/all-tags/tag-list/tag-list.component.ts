import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef} from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateTagDialogComponent } from '../../create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from '../../delete-tag-dialog/delete-tag-dialog.component';
import { Tag } from '../../tag.model';
import { TagService } from '../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-list',
  templateUrl: 'tag-list.component.html',
  styleUrls: ['tag-list.component.css']
})
export class TagListComponent implements OnInit {
  showEditorFor: boolean[];
  @Input() tags: Tag[];
  @Input() tagsEditable: boolean;

  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private deleteDialogRef: MdDialogRef<DeleteTagDialogComponent>;
  private translatedResponse: string;

  constructor (private dialog: MdDialog,
               private tagService: TagService,
               private toasterService: ToasterService,
               private translateService: TranslateService) {}

  ngOnInit() {
    this.showEditorFor = this.tags.map(tag => false);
  }

  addSubtag(parentTag: Tag) {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, { height: '25em', width: '50em' });
    this.createDialogRef.componentInstance.parentTag = parentTag;
    this.createDialogRef.componentInstance.tag.layer = parentTag.layer;
    this.createDialogRef.componentInstance.tag.parentId = parentTag.id;
    this.createDialogRef.afterClosed().subscribe(
      (newSubtag: Tag) => {
        if (newSubtag) {
          this.tagService.createTag(newSubtag)
            .then(
              (newTagId: number) => this.tagService.setChildTag(parentTag.id, newTagId)
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

  deleteTag(tag: Tag) {
    this.deleteDialogRef = this.dialog.open(DeleteTagDialogComponent, { height: '14.5em' });
    this.deleteDialogRef.componentInstance.tagName = tag.name;
    this.deleteDialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.tagService.deleteTag(tag.id)
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

  toggleEditorFor(tagIndex: number) {
    this.showEditorFor[tagIndex] = !this.showEditorFor[tagIndex];
  }

  updateTag(tag: Tag, tagIndex: number) {
    this.toggleEditorFor(tagIndex);
    if (tag) {
      this.tagService.updateTag(tag)
        .then(
          response => this.toasterService.pop('success', this.translate('tag updated'))
        ).catch(
          error => this.toasterService.pop('error', this.translate('Error while saving'), error)
        );
    }
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
