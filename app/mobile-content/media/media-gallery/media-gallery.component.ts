import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditMediumDialogComponent } from '../edit-medium-dialog/edit-medium-dialog.component';
import { MediaService } from '../shared/media.service';
import { Medium, MediaTypeForSearch } from '../shared/medium.model';
import { Status, statusTypeForSearch } from '../../shared/status.model';
import { SupervisorGuard } from '../../../shared/guards/supervisor-guard';
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
  isSupervisor: boolean;
  inDeletedPage: boolean;


  // search parameters
  searchQuery = '';
  selectedStatus: statusTypeForSearch = 'ALL';
  @Input() selectedType: MediaTypeForSearch = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // image previews
  previews = new Map<number, SafeUrl>();
  previewsLoaded = false;

  // dialogs
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              public router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private supervisorGuard: SupervisorGuard) {
    if (router.url === '/mobile-content/media/deleted') {this.inDeletedPage = true; } else {this.inDeletedPage = false; }
  }

  ngOnInit() {
    this.getIsSupervisor();
    this.getPage(1);
  }

  getIsSupervisor() {
    this.supervisorGuard.isSupervisor().then(
      (response: boolean) => {
        this.isSupervisor = response;
      });
  }

  addMedium() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, {width: '35em'});
    this.uploadDialogRef.afterClosed().subscribe(
      (obj: any) => {
        if (obj) {
          let newMedium = obj.media;
          let file: File = obj.file;
          if (newMedium) {
            this.mediaService.postMedia(newMedium)
              .then(
                res => {
                  if (file) {
                    return this.mediaService.uploadFile(res, file);
                  }
                }
              ).then(
                () => {
                  this.toasterService.pop('success', this.translate('media saved'));
                  this.fetchMedia();
                }
              ).catch(
                err => this.toasterService.pop('error', this.translate('Error while saving'), err)
              );
          }
        }
      }
    );
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
          this.mediaService.deleteMedia(medium.id)
            .then(
              () => {
                this.toasterService.pop('success', this.translate('media deleted'));
                this.fetchMedia();
              }
            ).catch(
              (err) => {
                this.toasterService.pop('error', this.translate('Error while deleting'), err);
              }
            );
        }
      }
    );
  }

  editMedium(medium: Medium) {
    this.editDialogRef = this.dialog.open(EditMediumDialogComponent, { width: '30em', data: { medium: medium} });
    this.editDialogRef.afterClosed().subscribe(
      (obj: any) => {
        let editedMedium: Medium = obj.media;
        let file: File = obj.file;
        if (editedMedium) {
          this.mediaService.updateMedia(editedMedium)
            .then(
              response => {
                medium.description = editedMedium.description;
                medium.type = editedMedium.type;
                medium.status = editedMedium.status;
                medium.title = editedMedium.title;
                return file ? this.mediaService.uploadFile(editedMedium.id, file) : response;
              }
            ).then(
              () => {
                if (file) {
                  this.previews.delete(editedMedium.id);
                  this.loadPreviews();
                }
                this.toasterService.pop('success', this.translate('media updated'));
              }
            ).catch(
              err => this.toasterService.pop('error', this.translate('Error while updating'), err)
            );
        }
      }
    );
  }

  findMedia() {
    if (this.searchQuery.trim().length >= 3) {
      this.showingSearchResults = true;
      this.currentPage = 1;
      this.fetchMedia();
    } else if (this.searchQuery.trim().length < 1) {
      this.resetSearch();
    }
  }

  getPage(page: number) {
    this.currentPage = page;
    this.fetchMedia();
  }

  reloadList() {
    this.currentPage = 1;
    this.fetchMedia();
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.searchQuery = '';
    this.currentPage = 1;
    this.fetchMedia();
  }

  selectMedium(medium: Medium) {
    if (this.selectMode) {
      this.onSelect.emit(medium);
    }
  }

  private fetchMedia() {
    this.media = [];
    this.totalItems = undefined;
    let status = this.inDeletedPage ? 'Deleted' : this.selectedStatus;
    this.mediaService.getAllMedia(this.currentPage, this.pageSize, 'id', this.searchQuery, status, this.selectedType)
      .then(
        response => {
          this.media = response.items.map(obj => Medium.parseObject(obj));
          this.totalItems = response.total;
          if (this.media.some(medium => medium.isImage())) { this.loadPreviews(); }
        }
      ).catch(
        err => this.toasterService.pop('error', this.translate('Error while fetching'), err)
      );
  }

  private loadPreviews() {
    let previewable = this.media.filter(medium => medium.isImage() && !this.previews.has(medium.id));
    previewable.forEach(
      medium => {
        this.mediaService.downloadFile(medium.id, true)
          .then(
            response => {
              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => {
                this.previews.set(medium.id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
                this.previewsLoaded = previewable.every(m => this.previews.has(m.id));
              };
            }
          ).catch(
            error => {
              previewable.splice(previewable.findIndex(m => m.id === medium.id), 1);
              this.previews.delete(medium.id);
              this.previewsLoaded = previewable.every(m => this.previews.has(m.id));
            }
          );
      }
    );
  }

  private translate(data: string): string {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: any) => {
        translatedResponse = value as string;
      }
    );
    return translatedResponse;
  }
}
