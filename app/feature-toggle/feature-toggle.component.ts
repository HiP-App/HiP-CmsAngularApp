import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Feature } from './feature-toggle.model';
import { FeatureToggleService } from './feature-toggle.service';

@Component({
  moduleId: module.id,
  selector: 'hip-featuretoggle',
  templateUrl: 'feature-toggle.component.html',
  styleUrls: ['feature-toggle.component.css']
})
export class FeatureToggleComponent {
  private features: Feature;

  constructor(private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureToggleService) {
  }
}
