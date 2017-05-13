import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth-guard';
import { SupervisorGuard } from '../shared/guards/supervisor-guard';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { RoutesComponent } from './routes/routes.component';
import { TagsComponent } from './tags/tags.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';


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
  }
];

export const mobileContentRouting: ModuleWithProviders = RouterModule.forChild(mobileContentRoutes);
