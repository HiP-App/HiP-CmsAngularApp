import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AppComponent } from './app.component';
import {
  routing,
  appRoutingProviders } from './app.routing';
import { HttpModule } from '@angular/http';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { TranslateModule } from 'ng2-translate';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { AdminComponent } from './admin/admin.component';
import { MdIconModule } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { MdRadioModule } from '@angular2-material/radio';
import { MdListModule } from '@angular2-material/list';
import { MdCoreModule, MdRippleModule } from '@angular2-material/core';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { TopicModule } from './topics/topics.module';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdRadioModule,
    MdListModule,
    MdCoreModule,
    MdToolbarModule,
    MdSidenavModule,
    MdRippleModule,
    routing,
    TopicModule
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
    AdminComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ SidenavComponent ]
})
export class AppModule {
}
