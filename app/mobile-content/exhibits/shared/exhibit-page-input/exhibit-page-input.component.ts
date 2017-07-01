import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ExhibitPage } from '../exhibit-page.model';
import { MediaService } from '../../../media/shared/media.service';
import { Medium, mediaType } from '../../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../../media/select-medium-dialog/select-medium-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibit-page-input',
  styleUrls: ['exhibit-page-input.component.css'],
  templateUrl: 'exhibit-page-input.component.html'
})
export class ExhibitPageInputComponent implements OnInit {
  @Input() page: ExhibitPage;
  audioTitle = '';
  imageTitle = '';
  sliderTitles = new Map<number, string>();

  fontOptions = ExhibitPage.fontFamilies;
  pageTypes = ExhibitPage.pageTypeValues;

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private mediaService: MediaService) {}

  ngOnInit() {
    if (this.page.audio != null) {
      this.mediaService.getMediaById(this.page.audio)
        .then(
          audio => this.audioTitle = audio.title
        ).catch();
    }

    if (this.page.image != null) {
      this.mediaService.getMediaById(this.page.image)
        .then(
          image => this.imageTitle = image.title
        ).catch();
    }

    if (this.page.isSliderPage() && this.page.images && this.page.images.length > 0) {
      Promise.all(this.page.images.map(img => this.mediaService.getMediaById(img.image)))
        .then(
          (images: Medium[]) => images.forEach(img => this.sliderTitles.set(img.id, img.title))
        ).catch();
    }
  }

  changeType() {
    if (this.page.isSliderPage()) {
      this.page.images = [];
      this.page.hideYearNumbers = false;
      this.page.image = null;
    } else {
      this.page.images = null;
      this.page.hideYearNumbers = null;
    }
  }

  clearAudio(page: ExhibitPage) {
    page.audio = null;
    this.audioTitle = '';
  }

  clearImage(page: ExhibitPage) {
    page.image = null;
    this.imageTitle = '';
  }

  moveImageDown(image: any) {
    let pos = this.page.images.indexOf(image);
    if (pos < this.page.images.length) {
      this.page.images[pos] = this.page.images.splice(pos + 1, 1, this.page.images[pos])[0];
    }
  }

  moveImageUp(image: any) {
    let pos = this.page.images.indexOf(image);
    if (pos > 0) {
      this.page.images[pos] = this.page.images.splice(pos - 1, 1, this.page.images[pos])[0];
    }
  }

  selectMedia(type: mediaType, page: ExhibitPage) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          if (type === 'audio') {
            page.audio = selectedMedium.id;
            this.audioTitle = selectedMedium.title;
          }
          if (type === 'image') {
            if (page.isSliderPage()) {
              page.images.push({ date: '', image: selectedMedium.id });
              this.sliderTitles.set(selectedMedium.id, selectedMedium.title);
            } else {
              page.image = selectedMedium.id;
              this.imageTitle = selectedMedium.title;
            }
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
}
