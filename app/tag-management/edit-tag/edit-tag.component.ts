import { ActivatedRoute, Router } from '@angular/router';
import { ColorPickerService } from 'angular2-color-picker';
import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-edit-tag',
  templateUrl: 'edit-tag.component.html',
  styleUrls: ['edit-tag.component.css'],
})
export class EditTagComponent implements OnInit {
  @Input() tag = Tag.emptyTag();
  childTag = Tag.emptyTag();
  responseHandled = false;
  layers: String[] = ['Zeit', 'Raum', 'Perspektive'];
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private cpService: ColorPickerService,
              private translateService: TranslateService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id'];
      this.tagService.getTag(id)
        .then(response => this.tag = response)
        .catch(error => this.toasterService.pop('error', this.translate('Error fetching tag'), error));
    }
  }

  editTag() {
    this.tagService.updateTag(this.tag)
      .then(response => {
        this.responseHandled = true;
        this.toasterService.pop('success', this.translate('tag updated'));
        this.router.navigate(['/all-tags']);
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error while saving'), error));
  }

  selectLayer(selectedLayer: string) {
    this.tag.layer = selectedLayer;
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(value => {
      this.translatedResponse = value as string;
    });
    return this.translatedResponse;
  }
}
