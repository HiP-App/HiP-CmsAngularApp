import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { CreateFeatureDialogComponent } from './features/create-feature-dialog/create-feature-dialog.component';
import { CreateFeatureGroupDialogComponent } from
  './feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureDialogComponent } from './features/delete-feature-dialog/delete-feature-dialog.component';
import { DeleteFeatureGroupDialogComponent } from
  './feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { featureToggleRouting } from './feature-toggle.routing';
import { FeatureGroupService } from './feature-groups/shared/feature-group.service';
import { FeatureService } from './features/shared/feature.service';
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
    FeatureToggleComponent
  ],
  entryComponents: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    DeleteFeatureDialogComponent,
    DeleteFeatureGroupDialogComponent
  ],
  providers: [
    FeatureGroupService,
    FeatureService
  ]
})
export class FeatureToggleModule {}
