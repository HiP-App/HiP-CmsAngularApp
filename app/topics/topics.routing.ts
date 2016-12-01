import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../core/guards/auth-guard';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { SupervisorGuard } from '../core/guards/supervisor-guard';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { AddNewSubtopicComponent } from './topic-management/add-new-subtopic/add-new-subtopic.component';
import { ContentComponent } from './content/content.component';

import { ManageAttachmentsComponent } from './topic-management/manage-attachments/manage-attachments.component';

const topicRoutes: Routes = [
  {
    path: 'all-+topics',
    component: AllTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-+topics',
    component: MyTopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '+topics/:id',
    component: ShowTopicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '+topics/edit/:id',
    component: EditTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: '+topics/delete/:id',
    component: DeleteTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'new-topic',
    component: NewTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: '+topics/manage-attachments/:id',
    component: ManageAttachmentsComponent
  },
  {
    path: '+topics/:id/new-subtopic',
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
