import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule, MdTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ng2-tag-input';
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

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    featureToggleRouting,
    FormsModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
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
    FeatureService
  ]
})
export class FeatureToggleModule {}
