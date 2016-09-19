import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { TopicInputComponent } from './topic-management/topic-input/topic-input.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { SupervisorGuard } from '../core/guards/supervisor-guard';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';

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
    path: 'topics/edit/:id',
    component: EditTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'new-topic',
    component: NewTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  }
];

export const topicRouting: ModuleWithProviders = RouterModule.forChild(topicRoutes);
