import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogRef } from '@angular/material';
import { } from 'googlemaps';

import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';
import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { Exhibit } from '../shared/exhibit.model';
import { ExhibitService } from '../shared/exhibit.service';
import { MobilePageService } from '../../pages/shared/mobile-page.service';
import { TagService } from '../../tags/shared/tag.service';
import { MediaService } from '../../media/shared/media.service';
import { Tag } from '../../tags/shared/tag.model';

@Component({
    moduleId: module.id,
    selector: 'view-exhibit',
    templateUrl: 'view-exhibit.component.html',
    styleUrls: ['view-exhibit.component.css']
})

export class ViewExhibitComponent implements OnInit {

    id: number;
    exhibit: Exhibit;
    tags: Tag[] = [];
    imageUrl: SafeUrl;
    rating: any;

    private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
    private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;

  constructor(
        private route: ActivatedRoute,
        private dialog: MdDialog,
        private domSanitizer: DomSanitizer,
        private toasterService: ToasterService,
        private translateService: TranslateService,
        private exhibitService: ExhibitService,
        private mobilePageService: MobilePageService,
        private tagService: TagService,
        private mediaService: MediaService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getId();
    }

    private getId() {
        this.route.params
            .subscribe(params => {
                this.id = +params['id'];
                this.getExhibit();
            });
    }

    private getExhibit() {
        this.exhibitService
            .getExhibit(this.id)
            .then((exhibit: Exhibit) => {
                this.exhibit = exhibit;
                this.getTags();
                this.getImage();
                this.getRating();
            })
            .catch((error: any) => {
                this.toasterService.pop('error', this.translate('Error fetching exhibit'), error);
            });
    }

    deleteExhibit(exhibit: Exhibit) {
        let context = this;
        this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
          data: {
            title: this.translateService.instant('delete exhibit'),
            message: this.translateService.instant('confirm delete exhibit', { name: exhibit.name })
          }
        });
        this.deleteDialogRef.afterClosed().subscribe(
          (confirmed: boolean) => {
            if (confirmed) {
              this.exhibitService.deleteExhibit(exhibit.id)
                .then(
                () => {
                  this.toasterService.pop('success', 'Success', exhibit.name + ' - ' + this.translate('exhibit deleted'));
                  this.router.navigate(['../../'], {relativeTo: this.route});
                }
                ).catch(
                error => this.toasterService.pop('error', this.translate('Error while saving'), error)
                );
            }
          }
        );
      }

    private getTags() {
        for (let tagId of this.exhibit.tags) {
            this.tagService
                .getTag(tagId)
                .then(tag => this.tags.push(tag))
                .catch((error: any) => {
                    this.toasterService.pop('error', this.translate('Error fetching tags'), error);
                });
        }
    }

    private getImage() {
        this.mediaService.downloadFile(this.exhibit.image, true)
            .then(response => {
                let reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = () => {
                    this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
                };
            });
    }

  private openHistory() {
    let context = this;
    this.exhibitService.getHistory(this.exhibit.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, { width: '60%',
            data: {
              title: context.exhibit.name,
              data: response
            }
          });
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', this.translate('Error fetching history') , error);
      }
    );
  }

  private getRating() {
      this.exhibitService.getExhibitRating(this.exhibit.id)
      .then(
          (response) => {
            this.rating = response;
          }
      ).catch(
        (error: any) => {
            this.toasterService.pop('error', this.translate('Error fetching ratings') , error);
        }
      );
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
