import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { AdminComponent } from './admin/admin.component';
import { TopicModule } from './topics/topics.module';
import { CoreModule } from './core/core.module';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material/material.module';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
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
    AboutComponent,
    HelpComponent,
    AdminComponent,
    FooterComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ SidenavComponent ]
})
export class AppModule {
}
