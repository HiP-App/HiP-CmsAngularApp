import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreatePageDialogComponent } from '../../create-page-dialog/create-page-dialog.component';
import { EditPageComponent } from '../../edit-page/edit-page.component';
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
  @Input() asInfoPage = false;
  @Input() excludeIds: number[] = [];
  @Input() selectMode = false;
  @Output() onSelect = new EventEmitter<MobilePage>();

  pages: MobilePage[];
  searchQuery = '';
  selectedStatus: statusTypeForSearch = 'ALL';
  showingSearchResults = false;
  statusOptions = Status.getValuesForSearch();

  private editDialogRef: MdDialogRef<EditPageComponent>;
  private createDialogRef: MdDialogRef<CreatePageDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private pageService: MobilePageService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.reloadList();
  }

  createPage() {
    this.createDialogRef = this.dialog.open(CreatePageDialogComponent);
    this.createDialogRef.afterClosed().subscribe(
      (newPage: MobilePage) => {
        if (!newPage) { return; }
        this.pageService.createPage(newPage)
          .then(
            newId => {
              newPage.id = newId;
              this.pages.push(newPage);
              this.toasterService.pop('success', this.translateService.instant('page created'));
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('create failed'))
          );
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
        this.pageService.deletePage(page.id)
          .then(
            () => {
              this.pages.splice(this.pages.indexOf(page), 1);
              this.toasterService.pop('success', this.translateService.instant('page deleted'));
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('delete failed'))
          );
      }
    );
  }

  editPage(page: MobilePage) {
    this.editDialogRef = this.dialog.open(EditPageComponent, { data: { pageToEdit: page } });
    this.editDialogRef.afterClosed().subscribe(
      (updatedPage: MobilePage) => {
        if (!updatedPage) { return; }
        this.pageService.updatePage(updatedPage)
          .then(
            () => {
              this.pages[this.pages.indexOf(page)] = updatedPage;
              this.toasterService.pop('success', this.translateService.instant('page updated'));
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('update failed'))
          );
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
        pages => {
          this.pages = pages;

          if (this.selectMode && this.excludeIds.length > 0) {
            this.pages = this.pages.filter(page => !this.excludeIds.includes(page.id));
          }

          if (this.selectMode && this.asInfoPage) {
            this.pages = this.pages.filter(page => !page.hasInfoPages());
          }
        }
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
