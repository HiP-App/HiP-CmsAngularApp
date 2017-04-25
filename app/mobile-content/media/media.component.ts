import { Component, OnInit } from '@angular/core';

import { MobileContentService } from '../mobile-content.service';

@Component({
  moduleId: module.id,
  selector: 'hip-media',
  templateUrl: 'media.component.html'
})
export class MediaComponent implements OnInit {
  constructor(private mobileContentService: MobileContentService) {}

  ngOnInit() {}
}
