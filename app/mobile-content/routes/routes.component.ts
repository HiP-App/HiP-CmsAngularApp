import { Component, OnInit } from '@angular/core';

import { MobileContentService } from '../mobile-content.service';

@Component({
  moduleId: module.id,
  selector: 'hip-routes',
  templateUrl: 'routes.component.html'
})
export class RoutesComponent implements OnInit {
  constructor(private mobileContentService: MobileContentService) {}

  ngOnInit() {}
}
