import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './feature/create-feature/create-feature.component';
import { CreateFeatureGroupDialogComponent } from './feature-group/create-feature-group/create-feature-group.component';
import { DeleteFeatureGroupDialogComponent } from './feature-group/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { EditFeatureGroupDialogComponent } from './feature-group/edit-feature-group/edit-feature-group-dialog.component';
import { FeatureComponent } from './feature/feature.component';
import { FeatureGroupComponent } from './feature-group/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { FeatureToggleRouting } from './feature-toggle.routing';
import { FeatureToggleService } from './feature-toggle.service'
import { SharedModule } from '../shared/shared.module';
import { TagInputComponent } from './shared/tag-input.component'
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
    DeleteFeatureGroupDialogComponent,
    EditFeatureGroupDialogComponent,
    FeatureComponent,
    FeatureGroupComponent,
    FeatureToggleComponent,
    TagInputComponent
  ],
  exports: [
    TagInputComponent
  ],
  entryComponents: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    EditFeatureGroupDialogComponent,
    DeleteFeatureGroupDialogComponent
  ],
  providers: [
    FeatureToggleService,
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule { }
