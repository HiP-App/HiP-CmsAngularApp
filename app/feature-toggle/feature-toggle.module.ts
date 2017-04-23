import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { FeatureDetailDialogComponent } from './feature/feature-detail/feature-detail.component';
import { FeatureDeleteDialogComponent } from './feature/feature-delete/feature-delete.component';
import { CreateFeatureGroupDialogComponent } from './feature-group/create-feature-group/create-feature-group.component';
import { FeatureToggleRouting } from './feature-toggle.routing';
import { FeatureComponent } from './feature/feature.component';
import { FeatureGroupComponent } from './feature-group/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { SharedModule } from '../shared/shared.module';
import { TopicModule } from '../topics/topics.module';
import {FeatureService} from './feature/feature.service'

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
    FeatureDetailDialogComponent,
    FeatureDeleteDialogComponent,
    CreateFeatureGroupDialogComponent,
    FeatureComponent,
    FeatureGroupComponent,
    FeatureToggleComponent
  ],
  exports: [

  ],
  entryComponents: [
    FeatureDetailDialogComponent,
    CreateFeatureGroupDialogComponent,
    FeatureDeleteDialogComponent
  ],
  providers: [
    MdUniqueSelectionDispatcher,
    FeatureService
  ]
})
export class FeatureToggleModule { }
