import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth-guard';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { PagesComponent } from './pages/pages.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { RoutesComponent } from './routes/routes.component';
import { SupervisorGuard } from '../shared/guards/supervisor-guard';
import { TagsComponent } from './tags/tags.component';

const mobileContentRoutes: Routes = [
  {
    path: 'exhibits',
    component: ExhibitsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exhibits/edit/:id',
    component: EditExhibitComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'media',
    component: MediaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages',
    component: PagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/edit/:id',
    component: EditPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'routes',
    component: RoutesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'routes/edit/:id',
    component: EditRouteComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/edit/:id',
    component: EditTagComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
];

export const mobileContentRouting: ModuleWithProviders = RouterModule.forChild(mobileContentRoutes);
