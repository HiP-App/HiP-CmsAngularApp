import { Component, OnInit } from '@angular/core';

import { MobileContentService } from '../mobile-content.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tags',
  templateUrl: 'tags.component.html'
})
export class TagsComponent implements OnInit {
  constructor(private mobileContentService: MobileContentService) {}

  ngOnInit() {}
}
