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
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContactComponent } from './contact/contact.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpComponent } from './help/help.component';
import { TopicModule } from './topics/topics.module';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { AdminModule } from './admin/admin.module';
import { EqualValidatorDirective } from './authentication/signup/equal-validator.directive';
import { ManageUserComponent } from '../app/userprofile/userprofile.component';
import { UploadPictureComponent } from '../app/shared/upload-picture/upload-picture.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    AdminModule,
    TopicModule,
    CoreModule,
    // Material
    MaterialModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    ToolbarComponent,
    SidenavComponent,
    ContactComponent,
    LegalNoticeComponent,
    HelpComponent,
    FooterComponent,
    ManageUserComponent,
    UploadPictureComponent,
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
