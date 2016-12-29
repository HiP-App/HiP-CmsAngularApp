import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-tag',
  templateUrl: '../shared/tag-input.component.html',
  styleUrls: ['../shared/tag-input.component.css'],
})
export class EditTagComponent implements OnInit {
  @Input() tag = Tag.emptyTag();
  responseHandled = false;
  layers: String[] = ['Zeit', 'Raum', 'Perspektive'];
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private router: Router) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id'];
      this.tagService.getTag(id)
        .then(
          (response: any) => this.tag = response
        ).catch(
          (error: any) => this.toasterService.pop('error', this.translate('Error fetching tag'), error)
        );
    }
  }

  saveTag() {
    this.tagService.updateTag(this.tag)
      .then(
        (response: any) => {
          this.responseHandled = true;
          this.toasterService.pop('success', this.translate('tag updated'));
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
