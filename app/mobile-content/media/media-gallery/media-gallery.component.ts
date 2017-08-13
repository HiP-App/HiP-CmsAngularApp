import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialog, MdDialogRef } from '@angular/material';
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
  url: SafeUrl;
  images: {imageUrl: SafeUrl, id: number }[] = [];

  // dialogs
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private service: MediaService,
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
        if (obj) {
          let newMedium = obj.media;
          let file: File = obj.file;
          if (newMedium) {
            this.service.postMedia(newMedium)
              .then(
                (res: any) => {
                  if (file) {
                    return this.service.uploadFile(res, file);
                  }
                }
              ).then(
              () => {
                this.toasterService.pop('success', this.translate('media saved'));
                this.readMedias();
              }
            ).catch(
              (err) => {
                this.toasterService.pop('error', this.translate('Error while saving'), err);
              }
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
          this.service.deleteMedia(medium.id)
            .then(
              () => {
                this.toasterService.pop('success', this.translate('media deleted'));
                this.readMedias();
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
          this.service.updateMedia(editedMedium)
            .then(
              (res: any) => {
                this.toasterService.pop('success', this.translate('media updated'));
                medium.description = editedMedium.description;
                medium.type = editedMedium.type;
                medium.status = editedMedium.status;
                medium.title = editedMedium.title;
                if (file) {
                  setTimeout(
                    () => {
                    return this.service.uploadFile(editedMedium.id, file);
                  }, 3000);
                }
              }
            ).catch(
              (err) => {
                this.toasterService.pop('error', this.translate('Error while updating'), err);
              }
            );
        }
      }
    );
  }

  findMedia() {
    this.showingSearchResults = true;
    this.currentPage = 1;
    this.readMedias();
  }

  getPage(page: number) {
    this.currentPage = page;
    this.readMedias();
  }

  reloadList() {
    this.currentPage = 1;
    this.readMedias();
  }

  resetSearch() {
    this.showingSearchResults = false;
    this.searchQuery = '';
    this.currentPage = 1;
    this.readMedias();
  }

  selectMedium(medium: Medium) {
    this.onSelect.emit(medium);
  }

  private readMedias() {
    this.media = [];
    this.images = [];
    this.totalItems = 0;
    let selectedType = this.selectedType === 'ALL' ? undefined : this.selectedType;
    this.service.getAllMedia(this.currentPage, this.pageSize, 'id', this.searchQuery, this.selectedStatus, selectedType)
      .then(
        (res) => {
          this.media = res.items;
          this.totalItems = res.total;
          for (let t = 0; t < this.media.length; t++) {
            if (this.media[t].type === 'Image') {
              this.getImage(this.media[t].id);
            }
          }
        }
      ).catch(
        (err) => {
          this.toasterService.pop('error', this.translate('Error while fetching'), err);
        }
      );
  }

  getImage(id: number)  {
    // preview image
    this.service.downloadFile(id, true)
      .then(
        (response: any) => {
          let base64Data: string;
          let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = function () {
              base64Data = reader.result;
            };
          setTimeout(() => {
            this.url = this.sanitizer.bypassSecurityTrustUrl(base64Data);
            this.images.push({imageUrl: this.url, id: id});
          }, 10);
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
