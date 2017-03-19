import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TagService } from '../../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-frequency',
  templateUrl: 'tag-frequency-analysis.component.html',
  styleUrls: ['tag-frequency-analysis.component.css']
})

export class TagFrequencyComponent implements OnInit {
  frequencies: any[];
  tagFrequencyDetails: any[] = [];
  key = '';
  direction: number = -1;

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tag-frequency') {
      let topicId = +this.route.snapshot.params['id'];
      this.tagService.getTagFrequency(topicId)
        .then (
          (response: any) => {
            this.frequencies = response.json().tagFrequency;
            for (let tagFrequency of this.frequencies) {
              this.getTagName(tagFrequency);
            }
          }
        ).catch (
          (error: any) => console.error(error)
        );
    }
  }

  getTagName(tagFrequency: any) {
    this.tagService.getTag(tagFrequency.tagId)
      .then (
        (response: any) => {
          let tagName = response.name;
          this.tagFrequencyDetails.push({
            tagName: tagName,
            frequency: tagFrequency.count,
            word: tagFrequency.value
          });
        }
      ).catch (
        (error: any) => console.error(error)
      );
  }

  sort(value: string) {
    this.direction = this.direction * (-1);
    this.key = value;
  }
}
