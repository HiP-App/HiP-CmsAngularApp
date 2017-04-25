import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { RoutesComponent } from './routes/routes.component';
import { TagsComponent } from './tags/tags.component';

const mobileContentRoutes: Routes = [
  {
    path: 'exhibits',
    component: ExhibitsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'media',
    component: MediaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'routes',
    component: RoutesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [AuthGuard]
  }
];

export const mobileContentRouting: ModuleWithProviders = RouterModule.forChild(mobileContentRoutes);
