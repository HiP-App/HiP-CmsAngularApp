import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateExhibitPageDialogComponent } from '../create-exhibit-page-dialog/create-exhibit-page-dialog.component';
import { ExhibitPage } from '../shared/exhibit-page.model';
import { ExhibitPageService } from '../shared/exhibit-page.service';

import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-exhibit-pages',
  styleUrls: ['edit-exhibit-pages.component.css'],
  templateUrl: 'edit-exhibit-pages.component.html'
})
export class EditExhibitPagesComponent implements OnInit {
  @Input() exhibitId: number;
  pages: ExhibitPage[];
  statusOptions = Status.getValues();

  private createDialogRef: MdDialogRef<CreateExhibitPageDialogComponent>;
  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;

  constructor(private dialog: MdDialog,
              private exhibitPageService: ExhibitPageService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.pages = ExhibitPage.getDummyArray();
    // this.exhibitPageService.getAllPages()
    //   .then(val => console.log(val))
    //   .catch(errorText => this.toasterService.pop('error', errorText));
  }

  createPage() {
    this.createDialogRef = this.dialog.open(CreateExhibitPageDialogComponent, { width: '35em' });
    this.createDialogRef.afterClosed().subscribe(
      (newPage: ExhibitPage) => {
        if (newPage) {
          newPage.exhibitId = this.exhibitId;
          // save page remotely
        }
      }
    );
  }

  deletePage(page: ExhibitPage) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: this.translateService.instant('delete page'),
        message: this.translateService.instant('confirm delete page', { title: page.title })
      }
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (confirmed: boolean) => {
        if (confirmed) {
          this.pages.splice(this.pages.indexOf(page), 1);
          // TODO: delete page remotely
        }
      }
    );
  }

  moveDown(array: Array<any>, element: any) {
    let pos = array.indexOf(element);
    if (pos < array.length) {
      array[pos] = array.splice(pos + 1, 1, array[pos])[0];
    }
  }

  moveUp(array: Array<any>, element: any) {
    let pos = array.indexOf(element);
    if (pos > 0) {
      array[pos] = array.splice(pos - 1, 1, array[pos])[0];
    }
  }

  savePage(page: ExhibitPage) {
    // TODO: save page remotely
  }
}
