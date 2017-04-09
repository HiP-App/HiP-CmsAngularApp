import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { FeatureToggleRouting } from './feature-toggle.routing';
import { FeatureComponent } from './feature/feature.component';
import { FeatureGroupComponent } from './feature-group/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FeatureToggleRouting,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TagInputModule,
    TranslateModule,
    TopicModule,
  ],
  declarations: [
    FeatureComponent,
    FeatureGroupComponent,
    FeatureToggleComponent
  ],
  exports: [

  ],
  providers: [
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule { }
