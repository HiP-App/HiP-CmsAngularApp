import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdIconRegistry } from '@angular/material';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AppComponent } from './app.component';
import {
  routing,
  appRoutingProviders } from './app.routing';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContactComponent } from './contact/contact.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpComponent } from './help/help.component';

import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { EqualValidatorDirective } from './authentication/signup/equal-validator.directive';
import { ManageUserComponent } from './userprofile/userprofile.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TopicModule } from './topics/topics.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    AdminModule,
    DashboardModule,
    NotificationsModule,
    TopicModule,
    CoreModule,
    SharedModule,
    // Material
    MaterialModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ToolbarComponent,
    SidenavComponent,
    ContactComponent,
    LegalNoticeComponent,
    HelpComponent,
    FooterComponent,
    ManageUserComponent,
  ],
  providers: [
    appRoutingProviders,
    EqualValidatorDirective,
    MdIconRegistry
  ],
  bootstrap: [ SidenavComponent ]
})
export class AppModule {
}

