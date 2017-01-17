import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { AuthGuard } from '../core/guards/auth-guard';

const tagRoutes: Routes = [
  {
    path: 'all-tags',
    component: AllTagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotation/:id',
    component: AnnotationComponent,
    canActivate: [AuthGuard]
  }
];

export const tagRouting: ModuleWithProviders = RouterModule.forChild(tagRoutes);
