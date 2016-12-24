import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-remove-sub-tag',
  templateUrl: 'remove-sub-tags.component.html',
})
export class RemoveSubTagComponent implements OnInit {
  @Input() tag = Tag.emptyTag();
  childTag = Tag.emptyTag();
  private childTags = new Array<Tag>();
  private disabledButtons = new Array<number>();
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'remove-sub-tag') {
      let id = +this.route.snapshot.params['id'];
      this.tagService.getTag(id)
        .then(response => {
          this.tag = response;
          this.getChildTags();
        })
        .catch(error => this.toasterService.pop('error', this.translate('Error fetching tag'), error));
    }
  }

  clicked(childTagId: number, childName: string) {
    this.disabledButtons.push(childTagId);
    this.childTag.id = childTagId;
    this.tagService.unsetChildTag(this.tag.id, this.childTag.id)
      .then(response => this.toasterService.pop('success', this.translate('subtag removed')))
      .catch(error => this.toasterService.pop('error', this.translate('Error while saving'), error));
  }

  isDisabled(childTagId: number) {
    return this.disabledButtons.includes(childTagId);
  }

  private getChildTags() {
    this.tagService.getChildTags(this.tag.id)
      .then(response => this.childTags = response)
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching subtags'), error));
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(value => {
      this.translatedResponse = value as string;
    });
    return this.translatedResponse;
  }
}
