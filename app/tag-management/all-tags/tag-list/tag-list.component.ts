import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef} from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AllTagsComponent } from '../all-tags.component';
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
  private dialogRef: MdDialogRef<DeleteTagDialogComponent>;
  private translatedResponse: string;

  constructor (private allTagsComponent: AllTagsComponent,
               private dialog: MdDialog,
               private tagService: TagService,
               private toasterService: ToasterService,
               private translateService: TranslateService) {}

  ngOnInit() {
    this.showEditorFor = this.tags.map(tag => false);
  }

  addSubtag(parentTag: Tag) {
    this.allTagsComponent.createTag(parentTag)
      .then(
        (newTag: Tag) => {
          if (newTag) {
            parentTag.childId.push(newTag.id);
          }
        }
      );
  }

  deleteTag(tag: Tag): void {
    this.dialogRef = this.dialog.open(DeleteTagDialogComponent, { height: '14.5em' });
    this.dialogRef.componentInstance.tagName = tag.name;
    this.dialogRef.afterClosed().subscribe(
      (deleteConfirmed: boolean) => {
        if (deleteConfirmed) {
          this.tagService.deleteTag(tag.id)
            .then(
              (response: any) => {

                // delete subtags if any exist
                if (tag.hasSubtags()) {
                  let subtags: Tag[] = this.getSubtags(tag);
                  Promise.all(tag.childId.map(id => this.tagService.deleteTag(id)))
                    .then(
                      (res: any) => {
                        // delete all local copies of subtags
                        for (let subtag of subtags) {
                          this.allTagsComponent.tags.splice(this.allTagsComponent.tags.indexOf(subtag), 1);
                        }
                        this.toasterService.pop('success', this.translate('tag deleted'));
                      }
                    );
                } else {
                  this.toasterService.pop('success', this.translate('tag deleted'));
                }

                // delete all local copies of the tag
                this.tags.splice(this.tags.indexOf(tag), 1);
                this.allTagsComponent.tags.splice(this.allTagsComponent.tags.indexOf(tag), 1);
              }
            ).catch(
              (error: any) => this.toasterService.pop('error', this.translate('Error while deleting'), error)
            );
        }
        this.dialogRef = null;
      }
    );
  }

  getSubtags(parentTag: Tag): Tag[] {
    return this.allTagsComponent.tags
             .filter(tag => parentTag.childId.includes(tag.id))
             .sort(Tag.tagAlphaCompare);
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
