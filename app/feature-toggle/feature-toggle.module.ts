import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './manage-features/create-feature-dialog/create-feature-dialog.component';
import { CreateFeatureGroupDialogComponent } from
  './manage-feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureDialogComponent } from './manage-features/delete-feature-dialog/delete-feature-dialog.component';
import { DeleteFeatureGroupDialogComponent } from
  './manage-feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { FeatureComponent } from './manage-features/feature.component';
import { FeatureGroupComponent } from './manage-feature-groups/feature-group.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { featureToggleRouting } from './feature-toggle.routing';
import { FeatureToggleService } from './feature-toggle.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    featureToggleRouting,
    FormsModule,
    SharedModule,
    TagInputModule,
    TranslateModule
  ],
  declarations: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    DeleteFeatureDialogComponent,
    DeleteFeatureGroupDialogComponent,
    FeatureComponent,
    FeatureGroupComponent,
    FeatureToggleComponent
  ],
  entryComponents: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    DeleteFeatureDialogComponent,
    DeleteFeatureGroupDialogComponent
  ],
  providers: [
    FeatureToggleService
  ]
})
export class FeatureToggleModule {}
