import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { EditMediumDialogComponent } from '../edit-medium-dialog/edit-medium-dialog.component';
import { MediaService } from '../shared/media.service';
import { Medium, MediaTypeForSearch } from '../shared/medium.model';
import { Status, statusTypeForSearch } from '../../shared/status.model';
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
  selectedStatus: statusTypeForSearch = 'ALL';
  @Input() selectedType: MediaTypeForSearch = 'ALL';
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  // image previews
  previews = new Map<number, SafeUrl>();

  // dialogs
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.getPage(1);
  }

  addMedium() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, {width: '35em'});
    this.uploadDialogRef.afterClosed().subscribe(
      (obj: any) => {
        if (!obj) { return; }

        let newMedium = obj.media;
        let file: File = obj.file;
        if (!newMedium) { return; }

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
              () => {
                this.toasterService.pop('success', this.translate('media updated'));
                medium.description = editedMedium.description;
                medium.type = editedMedium.type;
                medium.status = editedMedium.status;
                medium.title = editedMedium.title;
                if (file) {
                  this.previews.delete(editedMedium.id);
                  setTimeout(
                    () => {
                    return this.mediaService.uploadFile(editedMedium.id, file);
                  }, 3000);
                }
              }
            ).catch(
              err => this.toasterService.pop('error', this.translate('Error while updating'), err)
            );
        }
      }
    );
  }

  findMedia() {
    this.showingSearchResults = true;
    this.currentPage = 1;
    this.fetchMedia();
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
    if (!this.selectMode) { return; }
    this.onSelect.emit(medium);
  }

  private fetchMedia() {
    this.media = [];
    this.totalItems = undefined;
    this.mediaService.getAllMedia(this.currentPage, this.pageSize, 'id', this.searchQuery, this.selectedStatus, this.selectedType)
      .then(
        response => {
          this.media = response.items.map(obj => Medium.parseObject(obj));
          this.totalItems = response.total;
          this.media.filter(medium => medium.isImage()).forEach(image => this.getPreview(image.id))
        }
      ).catch(
        err => this.toasterService.pop('error', this.translate('Error while fetching'), err)
      );
  }

  private getPreview(id: number) {
    if (this.previews.has(id)) { return; }
    this.mediaService.downloadFile(id, true)
      .then(
        response => {
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            this.previews.set(id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
          };
        }
      ).catch();
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
