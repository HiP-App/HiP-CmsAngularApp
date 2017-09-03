import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewSubtopicComponent } from './topic-management/add-new-subtopic/add-new-subtopic.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { AuthGuard } from '../shared/guards/auth-guard';
import { ContentComponent } from './content/content.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { SupervisorGuard } from '../shared/guards/supervisor-guard';

const topicRoutes: Routes = [
  {
    path: '',
    component: AllTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my',
    component: MyTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: ShowTopicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: EditTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'delete/:id',
    component: DeleteTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'new',
    component: NewTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: ':id/new-subtopic',
    component: AddNewSubtopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'content/:id',
    component: ContentComponent,
    canActivate: [AuthGuard]
  }
];

export const topicRouting: ModuleWithProviders = RouterModule.forChild(topicRoutes);
