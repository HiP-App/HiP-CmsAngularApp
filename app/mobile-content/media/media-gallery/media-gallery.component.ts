import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditMediumDialogComponent } from '../edit-medium-dialog/edit-medium-dialog.component';
import { Medium, mediaType } from '../shared/medium.model';
import { Status, statusType } from '../../shared/status.model';
import { UploadMediumDialogComponent } from '../upload-medium-dialog/upload-medium-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-media-gallery',
  styleUrls: ['media-gallery.component.css'],
  templateUrl: 'media-gallery.component.html'
})
export class MediaGalleryComponent implements OnInit {
  @Input() selectMode = false;
  @Output() onSelect = new EventEmitter<Medium>();
  media: Medium[];
  statuses = Status.getValuesForSearch();
  types = ['ALL'].concat(Medium.types);

  // search parameters
  searchQuery = '';
  selectedStatus: 'ALL' | statusType = 'ALL';
  @Input() selectedType: 'ALL' | mediaType = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // dialogs
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.media = new Array(30);
    for (let i = 0; i < this.media.length; i++) {
      this.media[i] = Medium.getRandom();
    }

    // simulate type filtering
    // actual filtering will happen during API calls
    if (this.selectedType !== 'ALL') {
      this.media = this.media.filter(medium => medium.type === this.selectedType);
    }

    this.totalItems = this.media.length;
  }

  addMedium() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, { width: '35em' });
  }

  deleteMedium(medium: Medium) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete medium'),
        message: this.translateService.instant('confirm delete medium', { title: medium.title })
      }
    });
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
      (updatedMedium: Medium) => {
        if (updatedMedium) {
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
    this.searchQuery = '';
  }

  selectMedium(medium: Medium) {
    this.onSelect.emit(medium);
  }
}
