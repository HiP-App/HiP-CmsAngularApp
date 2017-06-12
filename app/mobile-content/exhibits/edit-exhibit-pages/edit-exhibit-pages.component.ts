import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';

import { ConfirmDeleteDialogComponent } from '../../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { ExhibitPage } from '../shared/exhibit-page.model';
import { Medium, mediaType } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
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

  private deleteDialogRef: MdDialogRef<ConfirmDeleteDialogComponent>;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private dialog: MdDialog,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.pages = ExhibitPage.getDummyArray();
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
          // TODO: delete page
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

  selectMedia(type: mediaType) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          // TODO: handle selected medium
        }
      }
    );
  }

  unset(array: Array<any>, element: any) {
    let pos = array.indexOf(element);
    if (pos > -1) {
      array.splice(pos, 1);
    }
  }
}
