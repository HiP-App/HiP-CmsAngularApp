import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Tag } from '../../../tag.model';
import { TagService } from '../../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-frequency',
  templateUrl: 'tag-frequency-analysis.component.html',
  styleUrls: ['tag-frequency-analysis.component.css']
})
export class TagFrequencyComponent implements OnInit {
  frequencies: any;
  tagNames: string[] = [];

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tag-frequency') {
      let topicId = +this.route.snapshot.params['id'];

      this.tagService.getTagFrequency(topicId)
      .then(
        (response: any) => {
          this.frequencies = response.json().tagFrequency;
          for (let tagFrequency of this.frequencies) {
            this.getTagName(tagFrequency.tagId);
          }
        }
        )
      .catch(
        (error: any) => console.error(error)
        );
    }
  }

  getTagName(tagId: number) {
    this.tagService.getTag(tagId)
    .then(
      (response: any) => this.tagNames.push(response.name)
      )
    .catch(
      (error: any) => console.error(error)
      );
  }
}
