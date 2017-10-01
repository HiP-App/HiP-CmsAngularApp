import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateExhibitDialogComponent } from './create-exhibit-dialog/create-exhibit-dialog.component';
import { ExhibitService } from './shared/exhibit.service';
import { Exhibit } from './shared/exhibit.model';
import { MediaService } from '../media/shared/media.service';
import { Route } from '../routes/shared/route.model';
import { RouteService } from '../routes/shared/routes.service';
import { Status } from '../shared/status.model';
import { Tag } from '../tags/shared/tag.model';
import { TagService } from '../tags/shared/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibits',
  styleUrls: ['exhibits.component.css'],
  templateUrl: 'exhibits.component.html'
})

export class ExhibitsComponent implements OnInit {
  exhibits: Exhibit[];
  existingTags: Tag[];
  previews = new Map<number, SafeUrl>();
  previewsLoaded = false;
  routes: Route[];
  statuses = Status.getValuesForSearch();
  private exhibitCache = new Map<number, Exhibit[]>();

  // search parameters
  searchQuery = '';
  selectedStatus = 'ALL';
  selectedRoute = -1;
  showingSearchResults = false;

  // pagination parameters
  exhibitsPerPage = 10;
  currentPage = 1;
  totalItems: number;

  // dialogs
  private createDialogRef: MdDialogRef<CreateExhibitDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private exhibitService: ExhibitService,
              private mediaService: MediaService,
              public  router: Router,
              private routeService: RouteService,
              private sanitizer: DomSanitizer,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    let allRoutesOption = Route.emptyRoute();
    allRoutesOption.title = 'ALL';
    this.routes = [allRoutesOption];

    this.routeService.getAllRoutes(1, 100)
    .then(
      data => this.routes = this.routes.concat(data.items)
    ).catch(
      error => console.error(error)
    );

    this.getPage(1);
  }

  createExhibit() {
    let context = this;
    this.createDialogRef = this.dialog.open(CreateExhibitDialogComponent, { width: '45em' });
    this.createDialogRef.afterClosed().subscribe(
      (newExhibit: Exhibit) => {
        if (newExhibit.latitude) {newExhibit.latitude = newExhibit.latitude.toString().replace(/,/g, '.'); }
        if (newExhibit.longitude) {newExhibit.longitude = newExhibit.longitude.toString().replace(/,/g, '.'); }
        if (newExhibit) {
          this.exhibitService.createExhibit(newExhibit)
            .then(
              () => {
                this.toasterService.pop('success', this.translate('exhibit saved'));
                setTimeout(function() {
                  context.reloadList();
                }, 1000);
              }
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
        }
        this.createDialogRef = null;
      }
    );
  }

  getTagNames() {
    let tagArray = '';
    for (let i = 0; i < this.exhibits.length; i++ ) {
      for ( let j = 0; j < this.exhibits[i].tags.length; j++ ) {
        if (tagArray.indexOf(this.exhibits[i].tags[j]) === -1) {
          tagArray = tagArray + '&IncludeOnly=' + this.exhibits[i].tags[j] + '&';
        }
      }
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray).then(
      response => {
        this.existingTags = response.items;
        for (let i = 0; i < this.exhibits.length; i++ ) {
          for ( let j = 0; j < this.exhibits[i].tags.length; j++ ) {
            let index = this.existingTags.map(function(x: Tag) {return x.id; }).indexOf(this.exhibits[i].tags[j]);
            this.exhibits[i].tags[j] = this.existingTags[index].title;
          }
        }
      }
    ).catch(
      error => this.toasterService.pop('error', this.translate('Error while saving'), error)
    );

  }

  getPage(page: number) {
    if (this.exhibitCache.has(page)) {
      this.exhibits = this.exhibitCache.get(page);
      this.currentPage = page;
    } else {
      this.exhibitService.getAllExhibits(page, this.exhibitsPerPage, this.selectedStatus,
                                         this.searchQuery, 'id', undefined,
                                         this.selectedRoute !== -1 ? [this.selectedRoute] : undefined)
        .then(
          data => {
            this.exhibits = data.items;
            this.totalItems = data.total;
            this.currentPage = page;
            this.exhibitCache.set(this.currentPage, this.exhibits);
            this.getTagNames();
            this.loadPreviews();
          }
        ).catch(
          error => console.error(error)
        );
    }
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
                setTimeout(function() {
                  context.reloadList();
                }, 1000);
              }
            ).catch(
              error => this.toasterService.pop('error', this.translate('Error while saving'), error)
            );
        }
      }
    );
  }

  findExhibits() {
    if (this.searchQuery.trim().length > 0) {
      this.exhibits = undefined;
      this.exhibitCache.clear();
      this.getPage(1);
      this.showingSearchResults = true;
    }
  }

  reloadList() {
    this.exhibits = undefined;
    this.exhibitCache.clear();
    this.getPage(1);
  }

  resetSearch() {
    this.searchQuery = '';
    this.exhibits = undefined;
    this.exhibitCache.clear();
    this.getPage(1);
    this.showingSearchResults = false;
  }

  private loadPreviews() {
    let previewable = this.exhibits.filter(exhibit => exhibit.image != null && !this.previews.has(exhibit.id));
    previewable.forEach(
      exhibit => {
        this.mediaService.downloadFile(exhibit.image, true)
          .then(
            response => {
              let reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => {
                this.previews.set(exhibit.id, this.sanitizer.bypassSecurityTrustUrl(reader.result));
                this.previewsLoaded = previewable.every(ex => this.previews.has(ex.id));
              };
            }
          ).catch(
            error => {
              previewable.splice(previewable.findIndex(ex => ex.id === exhibit.id), 1);
              this.previews.delete(exhibit.id);
              this.previewsLoaded = previewable.every(ex => this.previews.has(ex.id));
            }
          );
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
