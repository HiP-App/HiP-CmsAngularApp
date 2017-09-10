import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { MobilePage, pageType } from '../shared/mobile-page.model';
import { MobilePageService } from '../shared/mobile-page.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-page',
  templateUrl: 'edit-page.component.html'
})
export class EditPageComponent implements OnInit, DoCheck {
  page: MobilePage;
  private prevType: pageType;

  constructor(private activatedPage: ActivatedRoute,
              private pageService: MobilePageService,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    let pageId = +this.activatedPage.snapshot.params['id'];
    this.pageService.getPage(pageId)
      .then(
        response => {
          this.page = MobilePage.parseObject(JSON.parse(JSON.stringify(response)));
          this.prevType = this.page.pageType;
        }
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error fetching pages'), error)
    );
  }

  ngDoCheck() {
    if (this.prevType !== undefined && this.prevType !== this.page.pageType) {
      this.prevType = this.page.pageType;
    }
  }

  editPage(page: MobilePage) {
    this.pageService.updatePage(page)
      .then(
        response => {
          this.toasterService.pop('success', this.translate('Mobile page updated'));
          this.router.navigate(['/mobile-content/pages']);
          }
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error while updating'), error)
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
