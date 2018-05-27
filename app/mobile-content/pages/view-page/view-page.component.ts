import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MdDialogRef, MdDialog } from '@angular/material';
import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-view-page',
  templateUrl: 'view-page.component.html',
  styleUrls: ['view-page.component.css']
})
export class ViewPageComponent implements OnInit {
  pages: MobilePage[];
  page: MobilePage;
  audioTitle = '';
  imageTitle = '';
  imagePreviewURL: SafeUrl;
  infoPages = new Map<number, MobilePage>();
  sliderTitles = new Map<number, string>();
  sliderImages = new Map<number, SafeUrl>();

  canDelete = true;
  canEdit = true;

  // dialogs
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
    private location: Location,
    private mediaService: MediaService,
    private pageService: MobilePageService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toasterService: ToasterService,
    private userService: UserService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.pageService.getPage(+this.route.snapshot.params['id'])
      .then(
        response => {
          this.page = response;
          this.getCurrentUser();
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

  // implimented this method so that student can only edit or delete his page only.

  getCurrentUser() {
    this.userService.getCurrent()
      .then(
        (response) => {
          let currentUserId = response.id;
          for (let role of response.roles) {
            if (role === 'Student') {
              if (currentUserId !== this.page.userId) {
                this.canDelete = false;
                this.canEdit = false;
              } else {
                this.canDelete = true;
                this.canEdit = true;
              }
            }
          }

        }
      );
  }

  deletePage(page: MobilePage) {
    let context = this;
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
              // this.pages.splice(this.pages.indexOf(page), 1);
              this.toasterService.pop('success', this.translateService.instant('page deleted'));
              setTimeout(function () {
                context.reloadList();
              }, 1000);
            }
          ).catch(
            () => this.toasterService.pop('error', this.translateService.instant('delete failed'))
          );
      }
    );
  }

  reloadList() {
    this.location.replaceState('/'); // clears browser history so they can't navigate with back button
    this.router.navigateByUrl('/mobile-content/pages'); // redirects to page list
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
