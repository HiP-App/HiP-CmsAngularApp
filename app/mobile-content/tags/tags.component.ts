import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { Status } from '../shared/status.model';
import { Tag } from './shared/tag.model';

@Component({
  moduleId: module.id,
  selector: 'hip-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.css']
})
export class TagsComponent implements OnInit {
  tags: Tag[];
  statuses = Status.getValuesForSearch();

  // search parameters
  searchQuery = '';
  selectedStatus = '';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;

  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private translateService: TranslateService) {}

  ngOnInit() {
    // TODO: replace dummy data with appropriate API calls
    this.tags = new Array(30);
    this.totalItems = this.tags.length;
    for (let i = 0; i < this.tags.length; i++) {
      this.tags[i] = Tag.getRandom();
    }
  }

  createTag() {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
      (newTag: Tag) => {
        if (newTag) {
          // TODO: handle tag creation
        }
      }
    );
  }

  deleteTag(tag: Tag) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete tag'),
        message: this.translateService.instant('confirm delete tag', { name : tag.title })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          // TODO: implement tag deletion
        }
      }
    );
  }

  findTags() {
    this.showingSearchResults = true;
    // TODO
  }

  getPage(page: number) {
    this.currentPage = page;
    // TODO: implement pagination
  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
    this.showingSearchResults = false;
    // TODO
  }

}
