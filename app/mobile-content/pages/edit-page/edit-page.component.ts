import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { MobilePage } from '../shared/mobile-page.model';
import { MobilePageService } from '../shared/mobile-page.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-page',
  templateUrl: 'edit-page.component.html'
})
export class EditPageComponent implements OnInit {
  page: MobilePage;

  constructor(private location: Location,
              private pageService: MobilePageService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.pageService.getPage(+this.route.snapshot.params['id'])
      .then(
        response => this.page = response
      ).catch(
        error => this.toasterService.pop('error', this.translateService.instant('page load failed'), error)
      );
  }

  cancel() {
    this.location.back();
  }

  savePage() {
    this.pageService.updatePage(this.page)
      .then(
        response => {
          this.toasterService.pop('success', this.translateService.instant('page updated'));
          this.location.back();
        }
      ).catch(
        error => this.toasterService.pop('error', this.translateService.instant('update failed'), error)
      );
  }
}
