import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { NgxSpinnerService } from 'ngx-spinner';

import { ConfirmDeleteDialogComponent } from '../../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreatePageDialogComponent } from '../../create-page-dialog/create-page-dialog.component';
import { EditPageComponent } from '../../edit-page/edit-page.component';
import { MediaService } from '../../../media/shared/media.service';
import { MobilePage, pageTypeForSearch } from '../../shared/mobile-page.model';
import { MobilePageService } from '../../shared/mobile-page.service';
import { SupervisorGuard } from '../../../../shared/guards/supervisor-guard';
import { Status } from '../../../shared/status.model';

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
  @Output() onSelect = new EventEmitter<MobilePage[]>();

  pages: MobilePage[];
  previews = new Map<number, SafeUrl>();
  previewsLoaded = false;
  searchQuery = '';
  selectedPages: MobilePage[] = [];
  selectedStatus = 'ALL';
  selectedType: pageTypeForSearch = 'ALL';
  showingSearchResults = false;
  statusOptions = Status.getValuesForSearch();
  typeOptions = ['ALL'].concat(MobilePage.pageTypeValues);
  isSupervisor: boolean;
  inDeletedPage: boolean;


  private editDialogRef: MdDialogRef<EditPageComponent>;
  private createDialogRef: MdDialogRef<CreatePageDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private mediaService: MediaService,
              private pageService: MobilePageService,
              public  router: Router,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private supervisorGuard: SupervisorGuard,
              private spinnerService: NgxSpinnerService) {
    if (router.url === '/mobile-content/pages/deleted') {this.inDeletedPage = true; } else {this.inDeletedPage = false; }
  }

  ngOnInit() {
    this.spinnerService.show();
    this.getIsSupervisor();
    this.reloadList();
  }

  getIsSupervisor() {
    this.supervisorGuard.isSupervisor().then(
      (response: boolean) => {
        this.isSupervisor = response;
      });
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

  findPages() {
    if (this.searchQuery.trim().length >= 3) {
      this.showingSearchResults = true;
      this.reloadList();
    } else if (this.searchQuery.trim().length < 1) {
      this.resetSearch();
    }
  }

  reloadList() {
    this.selectedPages = [];
    this.onSelect.emit(this.selectedPages);
    let status = this.inDeletedPage ? 'Deleted' : this.selectedStatus;
    this.pageService.getAllPages(this.searchQuery, status, this.selectedType)
      .then(
        pages => {
          this.spinnerService.hide();
          this.pages = pages;
          this.loadPreviews();

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
    if (this.selectMode) {
      let pos = this.selectedPages.findIndex(p => p.id === page.id);
      if (pos === -1) {
        this.selectedPages.push(page);
      } else {
        this.selectedPages.splice(pos, 1);
      }
    }
    this.onSelect.emit(this.selectedPages);
  }

  private loadPreviews() {
    let previewable = this.pages.filter(page => page.getPreviewId() !== -1 && !this.previews.has(page.id));
    previewable.forEach(
      page => {
        this.mediaService.downloadFile(page.getPreviewId(), true)
          .then(
            response => {
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
}
