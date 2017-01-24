import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdTabChangeEvent } from '@angular/material';
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
  activeTabIndex = 0;
  layerTree = new Array<{ name: string, tags: Tag[] }>();
  tagsLoaded = false;
  userCanCreateTags = false;
  userCanEditTags = false;

  private dialogRef: MdDialogRef<CreateTagDialogComponent>;
  private translatedResponse: string;

  constructor(private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.tagService.tags.subscribe(
      (allTags: Tag[]) => {
        if (allTags.length > 0) {
          this.layerTree = [];
          for (let layer of Tag.layers) {
            let layerTags = allTags.filter(tag => tag.layer === layer && !tag.isSubtag());
            this.layerTree.push({ name: layer, tags: layerTags });
          }

          this.tagsLoaded = true;
        }
      },
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

  createTag() {
    this.dialogRef = this.dialog.open(CreateTagDialogComponent, { height: '25em', width: '50em' });
    this.dialogRef.componentInstance.tag.layer = Tag.layers[this.activeTabIndex];
    this.dialogRef.afterClosed().subscribe(
      (newTag: Tag) => {
        if (newTag) {
          this.tagService.createTag(newTag)
            .then(
              response => this.toasterService.pop('success', this.translate('tag saved'))
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
        }
        this.dialogRef = null;
      }
    );
  }

  setActiveTab(event: MdTabChangeEvent) {
    this.activeTabIndex = event.index;
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
