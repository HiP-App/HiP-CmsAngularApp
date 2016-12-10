import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdUniqueSelectionDispatcher } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { dashboardRouting } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';
import { TopicModule } from '../topics/topics.module';
import { NotificationsModule } from '../notifications/notifications.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TagInputModule,
    TranslateModule,

    dashboardRouting,
    TopicModule,
    NotificationsModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    MdUniqueSelectionDispatcher
  ]
})
export class DashboardModule { }
