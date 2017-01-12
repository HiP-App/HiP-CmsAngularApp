import { Component, OnInit } from '@angular/core';
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
export class NewTagComponent implements OnInit {
  layers = ['Perspektive', 'Raum', 'Zeit'].sort();
  tag = Tag.emptyTag();
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router) {}

  ngOnInit() {
    this.tag.layer = this.layers[0];
    this.tag.style = '#000000';
  }

  saveTag() {
    this.tagService.createTag(this.tag)
      .then(
        (response: any) => {
          this.toasterService.pop('success', this.translate('tag saved'));
          this.router.navigate(['/all-tags']);
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error while saving'), error)
      );
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
