import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { Tag } from '../../../tag.model';
import { TagService } from '../../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-frequency',
  templateUrl: 'tag-frequency-analysis.component.html',
  styleUrls: ['tag-frequency-analysis.component.css']
})
export class TagFrequencyComponent {
  frequencies: any;
  tagName: string;

  constructor(private tagService: TagService,
  						private route: ActivatedRoute,
              private router: Router,) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'tag-frequency') {
      let topicId = +this.route.snapshot.params['id'];

	  	this.tagService.getTagFrequency(topicId)
	  	.then(
	  		(response: any) => this.frequencies = response
	  	)
	  	.catch(
	  		(error: any) => console.error(error)
	  	)
  	}
	}

  getTagName(tagId: number) {
    return this.tagService.getTag(tagId)
    .then(
        (response: any) => this.tagName = response
    )
    .catch(
      (error: any) => console.error(error)
    )
  }

}
