import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef} from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-all-tags',
  styleUrls: ['all-tags.component.css'],
  templateUrl: 'all-tags.component.html'
})
export class AllTagsComponent implements OnInit {
  layerTree = new Array<{ name: string, tags: Tag[] }>();
  tags: Tag[];
  treeLoaded = false;
  userCanCreateTags = false;
  userCanEditTags = false;
  private dialogRef: MdDialogRef<CreateTagDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.tagService.getAllTags()
      .then(
        (response: Tag[]) => {
          this.tags = response;
          this.buildTagTree();
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
      );

    this.tagService.currentUserCanCreateTags()
      .then(
        (response: boolean) => this.userCanCreateTags = response
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching permissions'), error)
      );

    this.tagService.currentUserCanEditTags()
      .then(
        (response: boolean) => this.userCanEditTags = response
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching permissions'), error)
      );
  }

  createTag(parentTag?: Tag): Promise<Tag> {
    return new Promise((resolve, reject) => {
      this.dialogRef = this.dialog.open(CreateTagDialogComponent, { height: '25em', width: '50em' });

      if (parentTag) {
        this.dialogRef.componentInstance.parentTag = parentTag;
        this.dialogRef.componentInstance.tag.layer = parentTag.layer;
        this.dialogRef.componentInstance.tag.parentId = parentTag.id;
      }

      this.dialogRef.afterClosed().subscribe(
        (newTag: Tag) => {
          if (newTag) {
            this.tagService.createTag(newTag)
              .then(
                (newTagId: number) => {
                  newTag.id = newTagId;
                  this.tags.push(newTag);

                  if (parentTag) {
                    this.tagService.setChildTag(parentTag.id, newTagId)
                      .then(
                        (response: any) => {
                          this.toasterService.pop('success', newTag.name + ' ' + this.translate('added as subtag'));
                          resolve(newTag);
                        }
                      );
                  } else {
                    let rootTags = this.layerTree.find(layer => layer.name === newTag.layer).tags;
                    rootTags.push(newTag);
                    rootTags.sort(Tag.tagAlphaCompare);
                    this.toasterService.pop('success', this.translate('tag saved'));
                    resolve(newTag);
                  }
                }
              ).catch(
                (error: any) => this.toasterService.pop('error', this.translate('Error while saving'), error)
              );
          } else {
            resolve(undefined);
          }
          this.dialogRef = null;
        }
      );
    });
  }

  /**
   * Updates all tags with parent/child information and builds a tree of tags grouped by layer.
   */
  private buildTagTree(): void {
    Promise.all(this.tags.map(tag => this.tagService.getChildTags(tag.id)))
      .then(
        (response: Tag[][]) => {
          // set childId and parentId for all tags
          for (let i = 0; i < response.length; i++) {
            this.tags[i].childId = response[i].map(tag => tag.id);

            let childTags = this.tags.filter(tag => this.tags[i].childId.includes(tag.id));
            for (let childTag of childTags) {
              childTag.parentId = this.tags[i].id;
            }
          }

          // group root tags by layer
          for (let layer of Tag.layers) {
            let layerTags = this.tags.filter(tag => tag.layer === layer && !tag.isSubtag());
            this.layerTree.push({ name: layer, tags: layerTags });
          }

          this.treeLoaded = true;
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching subtags'), error)
      );
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
