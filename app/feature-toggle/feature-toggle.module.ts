import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './manage-features/create-feature-dialog/create-feature-dialog.component';
import { CreateFeatureGroupDialogComponent } from
  './manage-feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureGroupDialogComponent } from
  './manage-feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { DeleteFeatureDialogComponent } from './manage-features/delete-feature-dialog/delete-feature-dialog.component';
import { FeatureComponent } from './manage-features/feature.component';
import { FeatureGroupComponent } from './manage-feature-groups/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { featureToggleRouting } from './feature-toggle.routing';
import { FeatureToggleService } from './feature-toggle.service';
import { SharedModule } from '../shared/shared.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    featureToggleRouting,
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
    FeatureComponent,
    CreateFeatureDialogComponent,
    DeleteFeatureDialogComponent,
    FeatureGroupComponent,
    FeatureToggleComponent,
  ],
  entryComponents: [
    CreateFeatureGroupDialogComponent,
    DeleteFeatureGroupDialogComponent,
    CreateFeatureDialogComponent,
    DeleteFeatureDialogComponent
  ],
  providers: [
    FeatureToggleService,
    MdUniqueSelectionDispatcher
  ]
})
export class FeatureToggleModule {
}
