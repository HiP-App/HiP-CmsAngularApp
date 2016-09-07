import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { NewTopicComponent } from './new-topic/new-topic.component';
import { SupervisorGuard } from '../core/guards/supervisor-guard';

const topicRoutes: Routes = [
  {
    path: 'my-topics',
    component: MyTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'topics/:id',
    component: ShowTopicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-topic',
    component: NewTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  }
];

export const topicRouting: ModuleWithProviders = RouterModule.forChild(topicRoutes);
