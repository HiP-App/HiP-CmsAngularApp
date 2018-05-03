import { MyExhibitsComponent } from './exhibits/my-exhibits/my-exhibits.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth-guard';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { ViewExhibitComponent } from './exhibits/view-exhibit/view-exhibit.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { MediaComponent } from './media/media.component';
import { PagesComponent } from './pages/pages.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { RoutesComponent } from './routes/routes.component';
import { SupervisorGuard } from '../shared/guards/supervisor-guard';
import { TagsComponent } from './tags/tags.component';
import { ViewPageComponent } from './pages/view-page/view-page.component';
import { ViewRouteComponent } from './routes/view-route/view-route.component';
import { MyRoutesComponent } from './routes/my-routes/my-routes.component';

const mobileContentRoutes: Routes = [
  {
    path: 'exhibits',
    component: ExhibitsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exhibits/deleted',
    component: ExhibitsComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'exhibits/edit/:id',
    component: EditExhibitComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exhibits/my-exhibits',
    component: MyExhibitsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'achievements',
    component: AchievementsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exhibits/view/:id',
    component: ViewExhibitComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'media',
    component: MediaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'media/deleted',
    component: MediaComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'pages',
    component: PagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/deleted',
    component: PagesComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'pages/edit/:id',
    component: EditPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/view/:id',
    component: ViewPageComponent,
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
    canActivate: [AuthGuard]
  },
  {
    path: 'routes/deleted',
    component: RoutesComponent,
    canActivate: [AuthGuard, SupervisorGuard]

  },
  {
    path: 'routes/view/:id',
    component: ViewRouteComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'routes/my-routes',
    component: MyRoutesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags/deleted',
    component: TagsComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'tags/edit/:id',
    component: EditTagComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
];

export const mobileContentRouting: ModuleWithProviders = RouterModule.forChild(mobileContentRoutes);
