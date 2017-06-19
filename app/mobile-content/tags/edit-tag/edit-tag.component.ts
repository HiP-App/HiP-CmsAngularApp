import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Medium } from '../../media/shared/medium.model';
import { MediaService } from '../../media/shared/media.service';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Tag } from '../shared/tag.model';
import { TagService } from '../shared/tag.service';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-tags-edit-dialog',
  templateUrl: 'edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
  tag = Tag.emptyTag();
  private selectedImage: string;
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private translatedResponse: string;

  constructor(private activatedTag: ActivatedRoute,
              private dialog: MdDialog,
              private mediumService: MediaService,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    let tagId = +this.activatedTag.snapshot.params['id'];
    this.tagService.getTag(tagId)
      .then(
        response => {
          this.tag = response;
          if (this.tag.image !== null) {
            this.getImageDetails(this.tag.image);
          }
        }
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );
  }

  private getImageDetails(id: number) {
    this.mediumService.readById(id) .then(
      (response: any) => this.selectedImage = response.title
    ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching image'), error)
    );
  }

  editTag(tag: Tag) {
    this.tagService.updateTag(tag)
      .then(
        response => this.toasterService.pop('success', this.translate('tag updated'))
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error while updating'), error)
    );
  }

  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, {width: '75%', data: {type: type}});
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          this.selectedImage = selectedMedium.title;
          this.tag.image = selectedMedium.id;
        }
      }
    );
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }
}
