import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ChangeHistoryComponent } from '../../shared/change-history/change-history.component';
import { MobilePage } from '../shared/mobile-page.model';
import { MobilePageService } from '../shared/mobile-page.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-page',
  templateUrl: 'edit-page.component.html'
})
export class EditPageComponent implements OnInit {
  page: MobilePage;
  private changeHistoryDialogRef: MdDialogRef<ChangeHistoryComponent>;

  constructor(private location: Location,
              private pageService: MobilePageService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private dialog: MdDialog) {}

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

  openHistory() {
    let context = this;
    this.pageService.getHistory(this.page.id)
      .then(
        (response) => {
          this.changeHistoryDialogRef = this.dialog.open(ChangeHistoryComponent, { width: '60%',
            data: {
              title: context.page.title,
              data: response
            }
          });
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error',  this.translateService.instant('Error fetching history') , error);
      }
    );
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
