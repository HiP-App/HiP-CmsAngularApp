import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubTagComponent } from  './add-sub-tags/add-sub-tags.component';
import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AuthGuard } from '../core/guards/auth-guard';
import { AnnotationComponent } from  './annotation/annotation.component';
import { DeleteTagComponent } from  './delete-tag/delete-tag.component';
import { EditTagComponent } from  './edit-tag/edit-tag.component';
import { NewTagComponent } from  './new-tag/new-tag.component';
import { RemoveSubTagComponent } from  './remove-sub-tags/remove-sub-tags.component';

const tagRoutes: Routes = [
  {
    path: 'all-tags',
    component: AllTagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/edit/:id',
    component: EditTagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/delete/:id',
    component: DeleteTagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-tag',
    component: NewTagComponent,
    canActivate: [AuthGuard]
  },
    {
    path: 'tags/add-sub-tag/:id',
    component: AddSubTagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/remove-sub-tag/:id',
    component: RemoveSubTagComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'annotation/:id',
    component: AnnotationComponent,
    canActivate: [AuthGuard]
  }
];

export const tagRouting: ModuleWithProviders = RouterModule.forChild(tagRoutes);
