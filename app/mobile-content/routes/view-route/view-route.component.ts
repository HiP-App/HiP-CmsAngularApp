import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { ExhibitService } from '../../exhibits/shared/exhibit.service';
import { Medium } from '../../media/shared/medium.model';
import { MediaService } from '../../media/shared/media.service';
import { Route } from '../shared/route.model';
import { RouteService } from '../shared/routes.service';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Status } from '../../shared/status.model';
import { Tag } from '../../tags/shared/tag.model';
import { TagService } from '../../tags/shared/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-view-dialog',
  templateUrl: 'view-route.component.html',
  styleUrls: ['view-route.component.css']
})
export class ViewRouteComponent implements OnInit {
  route = Route.emptyRoute();
  statusOptions = Status.getValues();
  @ViewChild('autosize') autosize: any ;

  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  exhibits: Exhibit[] = [];
  maxItems = 90;

  private tags: Array<object> = [];
  private imageName: string;
  previewURL: SafeUrl;

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private routeService: RouteService,
              private mediaService: MediaService,
              private sanitizer: DomSanitizer,
              private toasterService: ToasterService,
              private exhibitService: ExhibitService,
              private translateService: TranslateService,
              private tagService: TagService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MdDialog) {}

  ngOnInit() {
    let id = +this.activatedRoute.snapshot.params['id'];
    let context = this;
    this.routeService.getRoute(id)
      .then(
        (response: Route) => {
          this.route = response;
          this.getTagNames();
          this.getMediaNames();
          this.getExhibitNames();
          setTimeout(function() { context.autosize.resizeToFitContent(); }, 200);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching topic') , error);
          this.router.navigate(['/error']);
        }
      );
  }

  previewImage(id: number) {
    // preview image
    this.mediaService.downloadFile(id, true)
      .then(
        response => {
          let base64Data: string;
          let reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            base64Data = reader.result;
            this.previewURL = this.sanitizer.bypassSecurityTrustUrl(base64Data);
          };
        }
      );
  }

  getTagNames() {
    let tagArray = '';
    for (let i = 0; i < this.route.tags.length; i++ ) {
      tagArray = tagArray + '&IncludeOnly=' + this.route.tags[i] + '&';
    }
    this.tagService.getAllTags(1, 50, 'ALL', '', 'id', tagArray)
      .then(
        response => {
          for (let tag of this.route.tags) {
            let index = response.items.map(function(x: Tag) {return x.id; }).indexOf(tag);
            let tagElement = {display: response.items[index].title, value: tag};
            this.tags.push( tagElement );
          }
        }
      ).catch(
        error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
      );
  }

  getMediaNames() {
    if (this.route.image) {
      this.mediaService.getMediaById(this.route.image)
        .then(
          (response: Route) => {
            this.imageName = response.title;
            this.previewImage(response.id);
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error media name') , error);
            this.router.navigate(['/error']);
          }
        );
    } else {
      this.imageName =  this.getTranslatedString('no image selected');
    }
  }

  getExhibitNames() {
    if (this.route.exhibits) {
      this.exhibitService.getAllExhibits(1, 100, 'All', '', 'id', this.route.exhibits)
        .then(
          response => {
            if (response.items) {
              for (let exhibit of this.route.exhibits) {
                let index = response.items.map(function (x: Exhibit) {return x.id; }).indexOf( exhibit );
                this.exhibits.push(response.items[index]);
              }
            }
          }
        ).catch(
          error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
        );
    }
  }

  getTranslatedString(data: any) {
    let translatedResponse: string;
    this.translateService.get(data).subscribe(
      (value: any) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }

  deleteRoute(route: Route) {
    let context = this;
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete route'),
        message: this.translateService.instant('confirm delete route', { name : route.title })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.routeService.deleteRoute(route.id)
            .then(
              () => {
                this.toasterService.pop('success', route.title + ' - ' + this.getTranslatedString('route deleted'));
                this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
              }
            ).catch(
              error => this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error)
            );
        }
      }
    );
  }
}
