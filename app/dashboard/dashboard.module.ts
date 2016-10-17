import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { dashboardRouting } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';
import { TopicModule } from "../topics/topics.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TagInputModule,
    TranslateModule,
    dashboardRouting,
    TopicModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
