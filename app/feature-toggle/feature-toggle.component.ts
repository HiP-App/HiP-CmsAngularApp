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
export class FeatureToggleComponent implements OnInit {
  private features: Feature;

  constructor(private toasterService: ToasterService,
              private translateService: TranslateService,
              private featureService: FeatureToggleService) {}

  ngOnInit() {
    this.featureService.getAllFeatures()
      .then(
        (response: any) => {
          this.features = response;
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to fetch your feature'));
      }
    );
  }

  deleteFeatureToggle(id: number) {
    this.featureService.deleteFeature(id)
      .then(
        (response: any) => {
          this.toasterService.pop('success', 'Success', this.getTranslatedString('Feature toggle has been deleted'));
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', this.getTranslatedString('Not able to delete your feature'));
      }
    );
  }

  getTranslatedString(data: any) {
    let translatedResponse = '';
    this.translateService.get(data).subscribe(
      (value: string) => {
        translatedResponse = value;
      }
    );
    return translatedResponse;
  }
}
