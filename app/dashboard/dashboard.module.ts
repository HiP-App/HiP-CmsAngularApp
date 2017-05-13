import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule, UniqueSelectionDispatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { dashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { TopicModule } from '../topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    dashboardRouting,
    NotificationsModule,
    TopicModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    UniqueSelectionDispatcher
  ]
})
export class DashboardModule { }
