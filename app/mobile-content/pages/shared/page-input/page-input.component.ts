import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { MobilePage } from '../mobile-page.model';
import { MobilePageService } from '../mobile-page.service';
import { MediaService } from '../../../media/shared/media.service';
import { Medium, mediaType } from '../../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../../media/select-medium-dialog/select-medium-dialog.component';
import { SelectPageDialogComponent } from '../../select-page-dialog/select-page-dialog.component';
import { Status } from '../../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-page-input',
  styleUrls: ['page-input.component.css'],
  templateUrl: 'page-input.component.html'
})
export class PageInputComponent implements OnInit {
  @Input() page: MobilePage;
  audioTitle = '';
  imageTitle = '';
  imagePreviewURL: SafeUrl;
  infoPages = new Map<number, MobilePage>();
  sliderTitles = new Map<number, string>();

  fontOptions = MobilePage.fontFamilies;
  pageTypes = MobilePage.pageTypeValues;
  statusOptions = Status.getValues();

  private selectMediumDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private selectPageDialogRef: MdDialogRef<SelectPageDialogComponent>;

  constructor(private dialog: MdDialog,
              private mediaService: MediaService,
              private pageService: MobilePageService,
              private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.page.audio != null) {
      this.mediaService.getMediaById(this.page.audio)
        .then(
          audio => this.audioTitle = audio.title
        ).catch();
    }

    if (this.page.image != null) {
      this.showImagePreview();
      this.mediaService.getMediaById(this.page.image)
        .then(
          image => this.imageTitle = image.title
        ).catch();
    }

    if (this.page.hasInfoPages()) {
      Promise.all(this.page.additionalInformationPages.map(pageId => this.pageService.getPage(pageId)))
        .then(
          (pages: MobilePage[]) => pages.forEach(page => this.infoPages.set(page.id, page))
        ).catch();
    }

    if (this.page.images && this.page.images.length > 0) {
      Promise.all(this.page.images.map(img => this.mediaService.getMediaById(img.image)))
        .then(
          (images: Medium[]) => images.forEach(img => this.sliderTitles.set(img.id, img.title))
        ).catch();
    }
  }

  addInfoPages() {
    this.selectPageDialogRef = this.dialog.open(SelectPageDialogComponent, {
      width: '75%',
      data: {
        asInfoPage: true,
        excludeIds: [this.page.id, ...this.page.additionalInformationPages]
      }
    });
    this.selectPageDialogRef.afterClosed().subscribe(
      (selectedPages: MobilePage[]) => {
        if (selectedPages && selectedPages.length > 0) {
          this.page.additionalInformationPages = this.page.additionalInformationPages.concat(selectedPages.map(page => page.id));
          selectedPages.forEach(page => this.infoPages.set(page.id, page));
        }
      }
    );
  }

  clearAudio() {
    this.page.audio = null;
    this.audioTitle = '';
  }

  clearImage() {
    this.page.image = null;
    this.imageTitle = '';
    this.imagePreviewURL = null;
  }

  moveImageDown(image: any) {
    let pos = this.page.images.indexOf(image);
    if (pos < this.page.images.length) {
      this.page.images[pos] = this.page.images.splice(pos + 1, 1, this.page.images[pos])[0];
    }
  }

  movePageDown(pageId: number) {
    let infoPageIds = this.page.additionalInformationPages; // shorthand
    let pos = infoPageIds.indexOf(pageId);
    if (pos < infoPageIds.length) {
      infoPageIds[pos] = infoPageIds.splice(pos + 1, 1, infoPageIds[pos])[0];
    }
  }

  moveImageUp(image: any) {
    let pos = this.page.images.indexOf(image);
    if (pos > 0) {
      this.page.images[pos] = this.page.images.splice(pos - 1, 1, this.page.images[pos])[0];
    }
  }

  movePageUp(pageId: number) {
    let infoPageIds = this.page.additionalInformationPages; // shorthand
    let pos = infoPageIds.indexOf(pageId);
    if (pos > 0) {
      infoPageIds[pos] = infoPageIds.splice(pos - 1, 1, infoPageIds[pos])[0];
    }
  }

  selectMedia(type: mediaType) {
    this.selectMediumDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectMediumDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (!selectedMedium) { return; }

        if (selectedMedium.isAudio()) {
          this.page.audio = selectedMedium.id;
          this.audioTitle = selectedMedium.title;
        }

        if (selectedMedium.isImage()) {
          if (this.page.isSliderPage()) {
            this.page.images.push({ date: '', image: selectedMedium.id });
            this.sliderTitles.set(selectedMedium.id, selectedMedium.title);
          } else {
            this.page.image = selectedMedium.id;
            this.imageTitle = selectedMedium.title;
            this.showImagePreview();
          }
        }
      }
    );
  }

  unsetImage(image: any) {
    let pos = this.page.images.indexOf(image);
    if (pos > -1) {
      this.page.images.splice(pos, 1);
    }
  }

  unsetPage(pageId: number) {
    let pos = this.page.additionalInformationPages.indexOf(pageId);
    if (pos > -1) {
      this.page.additionalInformationPages.splice(pos, 1);
    }
  }

  private showImagePreview() {
    this.mediaService.downloadFile(this.page.image, true)
      .then(
        response => {
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => this.imagePreviewURL = this.sanitizer.bypassSecurityTrustUrl(reader.result);
        }
      ).catch();
  }
}
