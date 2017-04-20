import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './feature/create-feature/create-feature.component';
import { CreateFeatureGroupDialogComponent } from './feature-group/create-feature-group/create-feature-group.component';
import { FeatureComponent } from './feature/feature.component';
import { FeatureGroupComponent } from './feature-group/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { FeatureToggleRouting } from './feature-toggle.routing';
import { SharedModule } from '../shared/shared.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FeatureToggleRouting,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    TagInputModule,
    TranslateModule,
    TopicModule,
  ],
  declarations: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    FeatureComponent,
    FeatureGroupComponent,
    FeatureToggleComponent
  ],
  exports: [

  ],
  entryComponents: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent
  ],
  providers: [
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule { }
