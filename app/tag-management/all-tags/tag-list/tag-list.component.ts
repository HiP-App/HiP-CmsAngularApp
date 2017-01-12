import { Component, Input } from '@angular/core';
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
export class TagListComponent {
  @Input() tags: Tag[];
  @Input() tagsEditable: boolean;
  private dialogRef: MdDialogRef<DeleteTagDialogComponent>;
  private translatedResponse: string;

  constructor (private allTagsComponent: AllTagsComponent,
               private dialog: MdDialog,
               private tagService: TagService,
               private toasterService: ToasterService,
               private translateService: TranslateService) {}

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
                if (tag.hasSubtags()) {
                  let subtags: Tag[] = this.getSubtags(tag);
                  Promise.all(tag.childId.map(id => this.tagService.deleteTag(id)))
                    .then(
                      (res: any) => {
                        this.toasterService.pop('success', this.translate('tag deleted'));
                        for (let subtag of subtags) {
                          this.allTagsComponent.tags.splice(this.allTagsComponent.tags.indexOf(subtag), 1);
                        }
                      }
                    );
                } else {
                  this.toasterService.pop('success', this.translate('tag deleted'));
                }

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

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }
}
