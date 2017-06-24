import { Component, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { ExhibitPage } from '../exhibit-page.model';
import { Medium, mediaType } from '../../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../../media/select-medium-dialog/select-medium-dialog.component';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibit-page-input',
  styleUrls: ['exhibit-page-input.component.css'],
  templateUrl: 'exhibit-page-input.component.html'
})
export class ExhibitPageInputComponent {
  @Input() page: ExhibitPage;
  audioTitle = '';
  imageTitle = '';
  pageTypes = ExhibitPage.pageTypeValues;

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private dialog: MdDialog) {}

  clearAudio(page: ExhibitPage) {
    page.audio = null;
    this.audioTitle = '';
  }

  clearImage(page: ExhibitPage) {
    page.image = null;
    this.imageTitle = '';
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

  selectMedia(type: mediaType, page: ExhibitPage) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          if (type === 'audio') {
            page.audio = selectedMedium.id;
            this.audioTitle = selectedMedium.title;
          }
          if (type === 'image') {
            if (page.type === 'SLIDER_PAGE') {
              page.images.push({ date: '', image: selectedMedium.id });
            } else {
              page.image = selectedMedium.id;
              this.imageTitle = selectedMedium.title;
            }
          }
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
