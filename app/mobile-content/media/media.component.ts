import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ContentStatus } from '../shared/content-status.model';
import { DeleteMediumDialogComponent } from './delete-medium-dialog/delete-medium-dialog.component';
import { EditMediumDialogComponent } from './edit-medium-dialog/edit-medium-dialog.component';
import { Medium } from './medium.model';

@Component({
  moduleId: module.id,
  selector: 'hip-media',
  styleUrls: ['media.component.css'],
  templateUrl: 'media.component.html'
})
export class MediaComponent implements OnInit {
  media: Medium[];
  statuses = ['ALL'].concat(ContentStatus.values);
  types = ['ALL'].concat(Medium.types);

  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  selectedType = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  private deleteDialogRef: MdDialogRef<DeleteMediumDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;

  constructor(private dialog: MdDialog) {}

  ngOnInit() {
    this.media = new Array(30);
    this.totalItems = this.media.length;
    for (let i = 0; i < this.media.length; i++) {
      this.media[i] = Medium.getRandom();
    }
  }

  addMedia() {}

  deleteMedium(medium: Medium) {
    this.deleteDialogRef = this.dialog.open(DeleteMediumDialogComponent);
    this.deleteDialogRef.componentInstance.mediumTitle = medium.title;
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          // TODO: implement medium deletion
        }
      }
    );
  }

  editMedium(medium: Medium) {
    this.editDialogRef = this.dialog.open(EditMediumDialogComponent, { width: '30em', data: { medium: medium } });
    this.editDialogRef.afterClosed().subscribe(
      (newMedium: Medium) => {
        if (newMedium) {
          // TODO: save edited medium
        }
      }
    );
  }

  findMedia() {
    // TODO: implement media search
    this.showingSearchResults = true;
  }

  getPage(page: number) {
    this.currentPage = page;
  }

  reloadList() {
    // TODO: implement list reload
  }

  resetSearch() {
    this.showingSearchResults = false;
  }
}
