import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureGroupDialogComponent } from './feature-group/create-feature-group/create-feature-group.component';
import { DeleteFeatureGroupDialogComponent } from './feature-group/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { EditFeatureGroupDialogComponent } from './feature-group/edit-feature-group/edit-feature-group-dialog.component';
import { FeatureComponent } from './feature/feature.component';
import { FeatureDetailDialogComponent } from './feature/feature-detail/feature-detail.component';
import { FeatureDeleteDialogComponent } from './feature/feature-delete/feature-delete.component';
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
    CreateFeatureGroupDialogComponent,
    DeleteFeatureGroupDialogComponent,
    EditFeatureGroupDialogComponent,
    FeatureComponent,
    FeatureDetailDialogComponent,
    FeatureDeleteDialogComponent,
    FeatureGroupComponent,
    FeatureToggleComponent,
    TagInputComponent
  ],
  exports: [
    TagInputComponent
  ],
  entryComponents: [
    CreateFeatureGroupDialogComponent,
    EditFeatureGroupDialogComponent,
    DeleteFeatureGroupDialogComponent,
    FeatureDetailDialogComponent,
    FeatureDeleteDialogComponent
  ],
  providers: [
    FeatureToggleService,
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule { }