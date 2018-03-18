import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { MobilePage } from '../shared/mobile-page.model';
import { MobilePageService } from '../shared/mobile-page.service';
import { MediaService } from '../../media/shared/media.service';
import { Medium, mediaType } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { SelectPageDialogComponent } from '../select-page-dialog/select-page-dialog.component';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-view-page',
  templateUrl: 'view-page.component.html',
  styleUrls: ['view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  page: MobilePage;
  audioTitle = '';
  imageTitle = '';
  imagePreviewURL: SafeUrl;
  infoPages = new Map<number, MobilePage>();
  sliderTitles = new Map<number, string>();
  sliderImages = new Map<number, SafeUrl>();

  constructor(private location: Location,
    private mediaService: MediaService,
    private pageService: MobilePageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toasterService: ToasterService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.pageService.getPage(+this.route.snapshot.params['id'])
      .then(
      response => {
        this.page = response;
        this.getImageTitle();
        this.getImagePreview();
        this.getInfoPages();
        this.getSliderImageTitles();
        this.getSliderImages();
      }
      ).catch(
      error => this.toasterService.pop('error', this.translateService.instant('page load failed'), error)
      );
  }

  getImagePreview() {
    if (this.page.image != null) {
      this.mediaService.downloadFile(this.page.image, true)
      .then(
      (response: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => this.imagePreviewURL = this.sanitizer.bypassSecurityTrustUrl(reader.result);
      }
      ).catch();
    }
  }

  getImageTitle() {
    if (this.page.image != null) {
      this.mediaService.getMediaById(this.page.image)
      .then(
        image => this.imageTitle = image.title
      ).catch();
    }
  }

  getInfoPages() {
    if (this.page.hasInfoPages()) {
      Promise.all(this.page.additionalInformationPages.map(pageId => this.pageService.getPage(pageId)))
        .then(
          (pages: MobilePage[]) => pages.forEach(page => this.infoPages.set(page.id, page))
        ).catch();
    }
  }

  getSliderImageTitles() {
    if (this.page.images && this.page.images.length > 0) {
      Promise.all(this.page.images.map(img => this.mediaService.getMediaById(img.image)))
        .then(
          (images: Medium[]) => images.forEach(img => this.sliderTitles.set(img.id, img.title))
        ).catch();
    }
  }

  getSliderImages() {
    if (this.page.images && this.page.images.length > 0) {
      Promise.all(this.page.images.map(img => this.mediaService.getMediaById(img.image)))
        .then(
          (images: Medium[]) => images.forEach(img => {
            this.mediaService.downloadFile(img.id, true)
            .then(
            (response: any) => {
              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => this.sliderImages.set(img.id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
            }
            ).catch();
          }
        ));
    }
  }
}
