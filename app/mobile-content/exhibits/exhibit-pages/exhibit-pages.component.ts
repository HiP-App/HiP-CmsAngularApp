import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { ExhibitService } from '../shared/exhibit.service';
import { MediaService } from '../../media/shared/media.service';
import { MobilePage, pageTypeForSearch } from '../../pages/shared/mobile-page.model';
import { MobilePageService } from '../../pages/shared/mobile-page.service';
import { SelectPageDialogComponent } from '../../pages/select-page-dialog/select-page-dialog.component';
import { Status, statusTypeForSearch } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibit-pages',
  styleUrls: ['exhibit-pages.component.css'],
  templateUrl: 'exhibit-pages.component.html'
})
export class ExhibitPagesComponent implements OnInit {
  @Input() exhibitId: number;
  @Input() isEdit: boolean;
  infoPages = new Map<number, MobilePage>();
  pages: MobilePage[];
  previews = new Map<number, SafeUrl>();
  previewsLoaded = false;
  searchStatusOptions = Status.getValuesForSearch();
  searchTypeOptions = ['ALL'].concat(MobilePage.pageTypeValues);
  selectedStatus: statusTypeForSearch = 'ALL';
  selectedType: pageTypeForSearch = 'ALL';
  statusOptions = Status.getValues();

  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private selectDialogRef: MdDialogRef<SelectPageDialogComponent>;

  constructor(private dialog: MdDialog,
              private exhibitService: ExhibitService,
              private mediaService: MediaService,
              private pageService: MobilePageService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.reloadList();
  }

  addPages() {
    this.selectDialogRef = this.dialog.open(SelectPageDialogComponent, { width: '75%' });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedPages: MobilePage[]) => {
        if (selectedPages && selectedPages.length > 0) {
          this.exhibitService.getExhibit(this.exhibitId)
            .then(
              exhibit => {
                exhibit.pages = exhibit.pages.concat(selectedPages.map(page => page.id));
                return this.exhibitService.updateExhibit(exhibit);
              }
            ).then(
              () => {
                this.pages = this.pages.concat(selectedPages);
                if (selectedPages.some(page => page.hasInfoPages())) { this.getInfoPages(); }
                this.toasterService.pop('success', this.translateService.instant('page added'));
              }
            ).catch(
              () => this.toasterService.pop('error', this.translateService.instant('addition failed'))
            );
        }
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
    this.pageService.getAllPagesFor(this.exhibitId, this.selectedStatus, this.selectedType)
      .then(
        pages => {
          this.pages = pages;
          if (this.pages.some(page => page.hasInfoPages())) {
            this.getInfoPages();
          } else {
            this.loadPreviews();
          }
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
    let infopageIds = this.pages.reduce(
      (prev, curr) => [...prev, ...curr.additionalInformationPages],
      new Array<number>()
    );

    Promise.all(infopageIds.map(pageId => this.pageService.getPage(pageId)))
      .then(
        infoPages => {
          infoPages.forEach(infoPage => this.infoPages.set(infoPage.id, infoPage));
          this.loadPreviews();
        }
      ).catch(
        () => this.toasterService.pop('error', this.translateService.instant('page load failed'))
      );
  }

  private loadPreviews() {
    let previewable = this.pages.concat(Array.from(this.infoPages.values()))
                      .filter((page, index, all) => all.findIndex(p => p.id === page.id) === index)
                      .filter(page => page.getPreviewId() !== -1 && !this.previews.has(page.id));
    previewable.forEach(
      page => {
        this.mediaService.downloadFile(page.getPreviewId(), true)
          .then(
            (response: any) => {
              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => {
                this.previews.set(page.id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
                this.previewsLoaded = previewable.every(p => this.previews.has(p.id));
              };
            }
          ).catch(
            error => {
              previewable.splice(previewable.findIndex(p => p.id === page.id), 1);
              this.previews.delete(page.id);
              this.previewsLoaded = previewable.every(p => this.previews.has(p.id));
            }
          );
      }
    );
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
