import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-add-sub-tag',
  templateUrl: 'add-sub-tags.component.html',
})
export class AddSubTagComponent implements OnInit {
  @Input() tag = Tag.emptyTag();
  childTag = Tag.emptyTag();
  private allTags = new Array<Tag>();
  private disabledButtons = new Array<number>();
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'add-sub-tag') {
      let id = +this.route.snapshot.params['id'];

      this.tagService.getTag(id)
        .then(
          (response: any) => {
            this.tag = response;
            this.getAllTags();
          }
        ).catch(
          (error: any) => this.toasterService.pop('error', this.translate('Error fetching tag'), error)
        );
    }
  }

  clicked(childTagId: any, childName: string) {
    this.disabledButtons.push(childTagId);
    this.childTag.id = childTagId;
    this.tagService.setChildTag(this.tag.id, this.childTag.id)
      .then(
        (response: any) => this.toasterService.pop('success', this.translate('tag updated'),
          childName + this.translate('added as subtag'))
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error while saving'), error)
      );
  }

  isDisabled(childTagId: any) {
    return this.disabledButtons.includes(childTagId);
  }

  private getAllTags() {
    this.tagService.getAllTags()
      .then(
        (response: any) => this.allTags = response
      ).catch(
        (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
      );
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(value => {
      this.translatedResponse = value as string;
    });
    return this.translatedResponse;
  }
}
