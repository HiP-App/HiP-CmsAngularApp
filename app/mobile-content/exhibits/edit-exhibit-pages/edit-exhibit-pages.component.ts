import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditPageComponent } from '../../pages/edit-page/edit-page.component';
import { ExhibitService } from '../shared/exhibit.service';
import { MobilePage } from '../../pages/shared/mobile-page.model';
import { MobilePageService } from '../../pages/shared/mobile-page.service';
import { SelectPageDialogComponent } from '../../pages/select-page-dialog/select-page-dialog.component';
import { Status, statusTypeForSearch } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-exhibit-pages',
  styleUrls: ['edit-exhibit-pages.component.css'],
  templateUrl: 'edit-exhibit-pages.component.html'
})
export class EditExhibitPagesComponent implements OnInit {
  @Input() exhibitId: number;
  infoPages = new Map<number, MobilePage>();
  pages: MobilePage[];
  searchStatusOptions = Status.getValuesForSearch();
  selectedStatus: statusTypeForSearch = 'ALL';
  statusOptions = Status.getValues();

  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private editDialogRef: MdDialogRef<EditPageComponent>;
  private selectDialogRef: MdDialogRef<SelectPageDialogComponent>;

  constructor(private dialog: MdDialog,
              private exhibitService: ExhibitService,
              private pageService: MobilePageService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.reloadList();
  }

  addPage() {
    this.selectDialogRef = this.dialog.open(SelectPageDialogComponent, { width: '75%' });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedPage: MobilePage) => {
        if (!selectedPage) { return; }
        this.exhibitService.getExhibit(this.exhibitId)
          .then(
            exhibit => {
              exhibit.pages.push(selectedPage.id);
              return this.exhibitService.updateExhibit(exhibit);
            }
          ).then(
            () => {
              this.pages.push(selectedPage);
              if (selectedPage.hasInfoPages()) { this.getInfoPages(); }
              this.toasterService.pop('success', this.translateService.instant('page added'));
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('addition failed'))
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
              if (this.pages.indexOf(page) > -1) {
                this.pages[this.pages.indexOf(page)] = updatedPage;
                this.getInfoPages();
              }

              if (this.infoPages.has(page.id)) {
                this.infoPages.set(page.id, updatedPage);
              }

              this.toasterService.pop('success', this.translateService.instant('page updated'));
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('update failed'))
          );
      }
    );
  }

  movePageDown(page: MobilePage) {
    let pos = this.pages.indexOf(page);
    if (pos < this.pages.length) {
      this.pages[pos] = this.pages.splice(pos + 1, 1, this.pages[pos])[0];
    }
    this.updatePageOrder();
  }

  movePageUp(page: MobilePage) {
    let pos = this.pages.indexOf(page);
    if (pos > 0) {
      this.pages[pos] = this.pages.splice(pos - 1, 1, this.pages[pos])[0];
    }
    this.updatePageOrder();
  }

  reloadList() {
    this.pageService.getAllPagesFor(this.exhibitId, this.selectedStatus)
      .then(
        pages => {
          this.pages = pages;
          this.getInfoPages();
        }
      ).catch(
        () => this.toasterService.pop('error', this.translateService.instant('page load failed'))
      );
  }

  unsetPage(page: MobilePage) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('unset page'),
        message: this.translateService.instant('confirm unset page', { title: page.title || '' })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (!confirmed) { return; }
        this.exhibitService.getExhibit(this.exhibitId)
          .then(
            exhibit => {
              exhibit.pages.splice(exhibit.pages.indexOf(page.id), 1);
              return this.exhibitService.updateExhibit(exhibit);
            }
          ).then(
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

  private getInfoPages() {
    for (let page of this.pages) {
      if (page.hasInfoPages()) {
        Promise.all(page.additionalInformationPages.map(pageId => this.pageService.getPage(pageId)))
          .then(
            infoPages => infoPages.forEach(infoPage => this.infoPages.set(infoPage.id, infoPage))
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('page load failed'))
          );
      }
    }
  }

  private updatePageOrder() {
    this.exhibitService.getExhibit(this.exhibitId)
      .then(
        exhibit => {
          exhibit.pages = this.pages.map(page => page.id);
          return this.exhibitService.updateExhibit(exhibit);
        }
      ).then(
        () => this.toasterService.pop('success', this.translateService.instant('page order updated'))
      ).catch(
        () => this.toasterService.pop('error', this.translateService.instant('update failed'))
      );
  }
}
