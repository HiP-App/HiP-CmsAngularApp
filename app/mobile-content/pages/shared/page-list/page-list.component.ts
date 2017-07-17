import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditPageDialogComponent } from '../../edit-page-dialog/edit-page-dialog.component';
import { MobilePage } from '../../shared/mobile-page.model';
import { MobilePageService } from '../../shared/mobile-page.service';
import { Status, statusTypeForSearch } from '../../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-page-list',
  styleUrls: ['page-list.component.css'],
  templateUrl: 'page-list.component.html'
})
export class PageListComponent implements OnInit {
  @Input() selectMode = false;
  @Output() onSelect = new EventEmitter<MobilePage>();

  pages: MobilePage[];
  searchQuery = '';
  selectedStatus: statusTypeForSearch = 'ALL';
  showingSearchResults = false;
  statusOptions = Status.getValuesForSearch();

  private editDialogRef: MdDialogRef<EditPageDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private pageService: MobilePageService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.reloadList();
  }

  createPage() {
    this.editDialogRef = this.dialog.open(EditPageDialogComponent, { width: '75%' });
    this.editDialogRef.afterClosed().subscribe(
      (newPage: MobilePage) => {
        if (!newPage) { return; }
        // TODO: save remotely, then add to local array
      }
    );
  }

  deletePage(page: MobilePage) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete page'),
        message: this.translateService.instant('confirm delete page', { title: page.title || '' })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (!confirmed) { return; }
        this.pages.splice(this.pages.indexOf(page), 1);
        // TODO: delete remotely
      }
    );
  }

  editPage(page: MobilePage) {
    this.editDialogRef = this.dialog.open(EditPageDialogComponent, { width: '75%', data: { pageToEdit: page } });
    this.editDialogRef.afterClosed().subscribe(
      (updatedPage: MobilePage) => {
        if (!updatedPage) { return; }
        this.pages[this.pages.indexOf(page)] = updatedPage;
        // TODO: save remotely
      }
    );
  }

  findPages() {
    if (this.searchQuery.trim().length > 0) {
      this.showingSearchResults = true;
      this.reloadList();
    }
  }

  reloadList() {
    this.pageService.getAllPages(this.searchQuery, this.selectedStatus)
      .then(
        pages => this.pages = pages
      ).catch();
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.searchQuery = '';
    this.reloadList();
  }

  selectPage(page: MobilePage) {
    if (!this.selectMode) { return; }
    this.onSelect.emit(page);
  }
}
