import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { TagFrequencyComponent } from  './annotation/content-analysis/tag-frequency-analysis/tag-frequency-analysis.component';
import { AuthGuard } from '../shared/guards/auth-guard';

const tagRoutes: Routes = [
  {
    path: 'annotation-tags',
    component: AllTagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotation/:id',
    component: AnnotationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tag-frequency/:id',
    component: TagFrequencyComponent,
    canActivate: [AuthGuard]
  }
];

export const tagRouting: ModuleWithProviders = RouterModule.forChild(tagRoutes);
