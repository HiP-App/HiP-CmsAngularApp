import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-new-tag',
  templateUrl: '../shared/tag-input.component.html',
  styleUrls: ['../shared/tag-input.component.css'],
})
export class NewTagComponent {
  layers = ['Zeit', 'Raum', 'Perspektive'];
  tag = Tag.emptyTag();
  responseHandled = false;
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router) {}

  saveTag() {
    this.tagService.createTag(this.tag)
      .then(
        (response: any) => {
          this.responseHandled = true;
          this.toasterService.pop('success', this.translate('tag saved'));
          this.router.navigate(['/all-tags']);
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error while saving'), error)
      );
  }

  selectLayer(selectedLayer: string) {
    this.tag.layer = selectedLayer;
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }
}
