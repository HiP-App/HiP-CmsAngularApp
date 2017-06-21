import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AllEntities } from '../../shared/shared.model';
import { DeleteMediumDialogComponent } from '../delete-medium-dialog/delete-medium-dialog.component';
import { EditMediumDialogComponent } from '../edit-medium-dialog/edit-medium-dialog.component';
import { Medium, mediaTypeForSearch, ServerError } from '../shared/medium.model';
import { MediaService } from '../shared/media.service';
import { Status, statusTypeForSearch } from '../../shared/status.model';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';
import { UploadMediumDialogComponent } from '../upload-medium-dialog/upload-medium-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-media-gallery',
  styleUrls: ['media-gallery.component.css'],
  templateUrl: 'media-gallery.component.html',
  providers: [ MediaService ]
})
export class MediaGalleryComponent implements OnInit {
  @Input() selectMode = false;
  @Output() onSelect = new EventEmitter<Medium>();
  media: Medium[];
  statuses = Status.getValuesForSearch();
  types = ['ALL'].concat(Medium.types);
  error: ServerError = null;

  // search parameters
  searchQuery = '';
  selectedStatus: statusTypeForSearch;
  @Input() selectedType: mediaTypeForSearch;
  showingSearchResults = false;

  // pagination parameters
  currentPage = 1;
  pageSize = 10;
  totalItems: number;   // must be fetched from server

  private translatedResponse: string;
  // dialogs
  private deleteDialogRef: MdDialogRef<DeleteMediumDialogComponent>;
  private editDialogRef: MdDialogRef<EditMediumDialogComponent>;
  private uploadDialogRef: MdDialogRef<UploadMediumDialogComponent>;

  constructor(private dialog: MdDialog , private service: MediaService,
              private toasterService: ToasterService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.selectedStatus = 'ALL';
    this.selectedType = 'ALL';
    this.getPage(1);
  }

  addMedium() {
    this.uploadDialogRef = this.dialog.open(UploadMediumDialogComponent, {width: '35em'});
    this.uploadDialogRef.afterClosed().subscribe(
      (obj: any) => {
        let newMedium = obj.media;
        let file: File = obj.file;
        if (newMedium) {
          this.service.postMedia(newMedium)
            .then(
              (res: any) => {
                if (file) {
                  return this.service.uploadFile(res, file);
                }
              })
            .then(
              () => {
                this.toasterService.pop('success', this.translate('media saved'));
                this.readMedias();
              }).catch(
            (err) => {
              this.toasterService.pop('error', this.translate('Error while saving'), err);
            }
          );
        }
      }
    );
  }

  deleteMedium(medium: Medium) {
    this.deleteDialogRef = this.dialog.open(DeleteMediumDialogComponent);
    this.deleteDialogRef.componentInstance.mediumTitle = medium.title;
    this.deleteDialogRef.afterClosed().subscribe(
        (confirmed: boolean) => {
          if (confirmed) {
            this.service.deleteMedia(medium.id)
                .then(
                   (res: any) => {
                     this.toasterService.pop('success', this.translate('media deleted'));
                     this.readMedias();
                }).catch(
                   (err) => {
                     this.toasterService.pop('error', this.translate('Error while deleting'), err);
                   }
                );
          }
        }
    );
  }

  editMedium(medium: Medium) {
    this.editDialogRef = this.dialog.open(EditMediumDialogComponent, { width: '30em', data: { medium: medium } });
    this.editDialogRef.afterClosed().subscribe(
        (newMedium: Medium) => {
          if (newMedium) {
            this.service.updateMedia(newMedium)
                .then(
                  (res: any) => {
                    this.toasterService.pop('success', this.translate('media updated'));
                    medium.description = newMedium.description;
                    medium.type = newMedium.type;
                    medium.status = newMedium.status;
                    medium.title = newMedium.title;
                }).catch(
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

  private setError(err: ServerError) {
    this.error = err;
  }

  private readMedias() {
    this.media = [];
    this.totalItems = 0;
    let selectedType = this.selectedType === 'ALL' ? undefined : this.selectedType;
    this.service.getAllMedia(this.currentPage, this.pageSize, 'id', this.searchQuery, this.selectedStatus, selectedType)
        .then(
           (res: AllEntities<Medium>) => {
           this.media = res.entities;
           this.totalItems = res.total;
        }).catch(
           (err) => { this.toasterService.pop('error', this.translate('Error while fetching'), err); }
        );
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

}
