import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewSubtopicComponent } from './topic-management/add-new-subtopic/add-new-subtopic.component';
import { AllTopicsComponent } from './all-topics/all-topics.component';
import { AuthGuard } from '../core/guards/auth-guard';
import { ContentComponent } from './content/content.component';
import { DeleteTopicComponent } from './topic-management/delete-topic/delete-topic.component';
import { EditTopicComponent } from './topic-management/edit-topic/edit-topic.component';
import { ManageAttachmentsComponent } from './topic-management/manage-attachments/manage-attachments.component';
import { MyTopicsComponent } from './my-topics-list/my-topics-list.component';
import { NewTopicComponent } from './topic-management/new-topic/new-topic.component';
import { ShowTopicComponent } from './show-topic/show-topic.component';
import { SupervisorGuard } from '../core/guards/supervisor-guard';
import { UploadDocumentComponent } from './topic-management/upload-document/upload-document.component';

const topicRoutes: Routes = [
  {
    path: 'all-topics',
    component: AllTopicsComponent,
    canActivate: [AuthGuard]
  },
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
    path: 'topics/delete/:id',
    component: DeleteTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'new-topic',
    component: NewTopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'topics/manage-attachments/:id',
    component: ManageAttachmentsComponent
  },
  {
    path: 'topics/:id/new-subtopic',
    component: AddNewSubtopicComponent,
    canActivate: [AuthGuard, SupervisorGuard]
  },
  {
    path: 'topic/:id/upload',
    component: UploadDocumentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'content/:id',
    component: ContentComponent,
    canActivate: [AuthGuard]
  }
];

export const topicRouting: ModuleWithProviders = RouterModule.forChild(topicRoutes);
