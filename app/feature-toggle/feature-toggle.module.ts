import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { FeatureToggleRouting } from './feature-toggle.routing';
import { FeatureToggleComponent } from './feature-toggle.component';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TagInputModule,
    TranslateModule,
    TopicModule,
    FeatureToggleRouting
  ],
  declarations: [
    FeatureToggleComponent
  ],
  exports: [

  ],
  providers: [
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule { }
