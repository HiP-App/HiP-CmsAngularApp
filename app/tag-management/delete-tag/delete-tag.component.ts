import { Component } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-tag',
  templateUrl: 'delete-tag.component.html',
})
export class DeleteTagComponent {
  tag = Tag.emptyTag();
  private responseHandled = false;
  private translatedResponse: string;

  constructor(private tagService: TagService, private route: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'delete') {
      let id = +this.route.snapshot.params['id'];
      this.tagService.getTag(id)
        .then(response => this.tag = response)
        .catch(error => this.toasterService.pop('error', this.translate('Error fetching tag'), error));
    }
  }

  deleteTag() {
    this.tagService.deleteTag(this.tag.id)
      .then(response => {
        this.toasterService.pop('success', this.translate('tag deleted'));
        this.responseHandled = true;
        this.router.navigate(['/all-tags']);
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error while deleting'), error));
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(value => {
      this.translatedResponse = value as string;
    });
    return this.translatedResponse;
  }
}
