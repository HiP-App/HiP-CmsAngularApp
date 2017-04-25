import { Component, OnInit } from '@angular/core';

import { MobileContentService } from '../mobile-content.service';

@Component({
  moduleId: module.id,
  selector: 'hip-exhibits',
  templateUrl: 'exhibits.component.html'
})
export class ExhibitsComponent implements OnInit {
  constructor(private mobileContentService: MobileContentService) {}

  ngOnInit() {}
}
