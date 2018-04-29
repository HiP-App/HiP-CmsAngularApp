import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdTabChangeEvent } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';

import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-all-tags',
  styleUrls: ['all-tags.component.css'],
  templateUrl: 'all-tags.component.html'
})
export class AllTagsComponent implements OnInit, OnDestroy {
  activeTabIndex = 0;
  layerTree: Array<{ name: string, tags: BehaviorSubject<Tag[]> }> = [];
  tagsLoaded = false;
  userCanCreateTags = false;
  userCanEditTags = false;

  private dialogRef: MdDialogRef<CreateTagDialogComponent>;
  private translatedResponse: string;
  private tagsSubscription: Subscription;

  constructor(private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private spinnerService: NgxSpinnerService) {}

  ngOnInit() {
    this.spinnerService.show();
    this.tagsSubscription = this.tagService.tags.subscribe(
      (allTags: Tag[]) => {
        if (allTags.length > 0) {
          for (let layer of Tag.layers) {
            let layerTags = allTags.filter(tag => tag.layer === layer && !tag.isSubtag());
            let layerObject = this.layerTree.find((lt) => lt.name === layer);
            if (layerObject === undefined) {
              this.layerTree.push({ name: layer, tags: new BehaviorSubject(layerTags) });
            } else {
              layerObject.tags = new BehaviorSubject(layerTags);
            }
          }
          this.tagsLoaded = true;
          this.spinnerService.hide();
        }
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toasterService.pop('error', this.translate('Error fetching tags'), error);
      }
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

  ngOnDestroy() {
    this.tagsSubscription.unsubscribe();
    this.spinnerService.hide();
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
