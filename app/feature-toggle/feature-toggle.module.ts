import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule,
  MdTabsModule } from '@angular/material';
import { TagInputModule } from 'ngx-chips';
import { TranslateModule } from 'ng2-translate';

import { AdminGuard } from '../shared/guards/admin-guard';
import { AuthGuard } from '../shared/guards/auth-guard';
import { CreateFeatureDialogComponent } from './features/create-feature-dialog/create-feature-dialog.component';
import { CreateFeatureGroupDialogComponent } from
  './feature-groups/create-feature-group-dialog/create-feature-group-dialog.component';
import { DeleteFeatureDialogComponent } from './features/delete-feature-dialog/delete-feature-dialog.component';
import { DeleteFeatureGroupDialogComponent } from
  './feature-groups/delete-feature-group-dialog/delete-feature-group-dialog.component';
import { EmailInputComponent } from './feature-groups/email-input/email-input.component';
import { FeatureToggleComponent } from './feature-toggle.component';
import { featureToggleRouting } from './feature-toggle.routing';
import { FeatureGroupService } from './feature-groups/shared/feature-group.service';
import { FeatureService } from './features/shared/feature.service';
import { FeatureToggleApiService } from '../shared/api/featuretoggle-api.service';

@NgModule({
  imports: [
    CommonModule,
    featureToggleRouting,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdTabsModule,
    TagInputModule,
    TranslateModule
  ],
  declarations: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    DeleteFeatureDialogComponent,
    DeleteFeatureGroupDialogComponent,
    EmailInputComponent,
    FeatureToggleComponent
  ],
  entryComponents: [
    CreateFeatureDialogComponent,
    CreateFeatureGroupDialogComponent,
    DeleteFeatureDialogComponent,
    DeleteFeatureGroupDialogComponent
  ],
  providers: [
    AdminGuard,
    AuthGuard,
    FeatureGroupService,
    FeatureService,
    FeatureToggleApiService
  ]
})
export class FeatureToggleModule {}
