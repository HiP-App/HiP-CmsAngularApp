import { Component, OnInit } from '@angular/core';
import { MdCheckboxChange } from '@angular/material';
import { MdDialogRef } from '@angular/material';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../topics/shared/topic.model';
import { TopicService } from '../topics/shared/topic.service';


@Component({
  moduleId: module.id,
  selector: 'hip-featuretoggle',
  templateUrl: 'feature-toggle.component.html',
  styleUrls: ['feature-toggle.component.css']
})
export class FeatureToggleComponent {

  constructor() {}

  ngOnInit() {

  }
}
