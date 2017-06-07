import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
import { Tag } from '../shared/tag.model';
import { TagService } from '../shared/tag.service';
import { TranslateService } from 'ng2-translate';
import { ToasterService } from 'angular2-toaster';

@Component({
  moduleId: module.id,
  selector: 'hip-tags-edit-dialog',
  templateUrl: 'edit-tag.component.html',
})
export class EditTagComponent implements OnInit {
  tag = Tag.emptyTag();

  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;
  private translatedResponse: string;

  constructor(private activatedTag: ActivatedRoute,
              private dialog: MdDialog,
              private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    let tagId = +this.activatedTag.snapshot.params['id'];
    // TODO: fetch exhibit from server by id
    this.tagService.getTag(tagId)
      .then(
        response => this.tag = response
      ).catch(
      error => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
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
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          // TODO: handle selected medium
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
