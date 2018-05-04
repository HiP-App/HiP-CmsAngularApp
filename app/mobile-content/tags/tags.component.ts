import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';

import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { Status } from '../shared/status.model';
import { SupervisorGuard } from '../../shared/guards/supervisor-guard';
import { Tag } from './shared/tag.model';
import { TagService } from './shared/tag.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  selector: 'hip-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.css']
})
export class TagsComponent implements OnInit, OnDestroy {
  tags: Tag[];
  statuses = Status.getValuesForSearch();
  isSupervisor: boolean;
  inDeletedPage: boolean;

  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;

  private tagCache = new Map<number, Tag[]>();

  private createDialogRef: MdDialogRef<CreateTagDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              public  router: Router,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private supervisorGuard: SupervisorGuard,
              private spinnerService: NgxSpinnerService) {
    if (router.url === '/mobile-content/tags/deleted') {this.inDeletedPage = true; } else {this.inDeletedPage = false; }
  }

  ngOnInit() {
    this.getIsSupervisor();
    this.getPage(1);
  }

  ngOnDestroy() {
    this.spinnerService.hide();
  }

  getIsSupervisor() {
    this.supervisorGuard.isSupervisor().then(
      (response: boolean) => {
        this.isSupervisor = response;
      });
  }

  createTag() {
    this.createDialogRef = this.dialog.open(CreateTagDialogComponent, {width: '45em'});
    this.createDialogRef.afterClosed().subscribe(
      (newTag: Tag) => {
        if (newTag) {
          this.tagService.createTag(newTag)
            .then(
              response => {
                this.toasterService.pop('success', this.translate('tag saved'));
                this.reloadList();
              }
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
        }
        this.createDialogRef = null;
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
          this.tagService.deleteTag(tag.id)
            .then(
              response => {
                this.toasterService.pop('success', this.translate('tag deleted'));
                this.reloadList();
              }
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while deleting'), error)
            );
        }
        this.deleteDialogRef = null;
      }
    );
  }

  findTags() {
    if (this.searchQuery.trim().length >= 3) {
      this.tags = undefined;
      this.tagCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    } else if (this.searchQuery.trim().length < 1) {
      this.resetSearch();
    }
  }

  getPage(page: number) {
    if (this.tagCache.has(page)) {
      this.tags = this.tagCache.get(page);
      this.currentPage = page;
    } else {
      this.spinnerService.show();
      let status = this.inDeletedPage ? 'Deleted' : this.selectedStatus;
      this.tagService.getAllTags(page, this.pageSize, status, this.searchQuery)
        .then(
          (data) => {
            this.spinnerService.hide();
            this.tags = data.items;
            this.totalItems = data.total;
            this.currentPage = page;
            this.tagCache.set(this.currentPage, this.tags);
          }
        ).catch(
          (error: string) => {
            console.error(error);
            this.spinnerService.hide();
          }
        );
    }
  }

  resetSearch() {
    this.searchQuery = '';
    this.tagCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
  }

  reloadList() {
    this.tags = undefined;
    this.tagCache.clear();
    this.getPage(this.currentPage);
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

}
