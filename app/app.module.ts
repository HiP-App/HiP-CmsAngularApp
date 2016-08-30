import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AppComponent } from './app.component';
import {
  routing,
  appRoutingProviders
} from './app.routing';
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
import { NewTopicComponent } from './topics/new-topic/new-topic.component';
import { MyTopicsComponent } from './topics/my-topics-list/my-topics-list.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TranslateModule.forRoot(),
    MdButtonModule,
    MdCardModule,
    routing
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
    NewTopicComponent,
    MyTopicsComponent,
    AdminComponent
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ SidenavComponent ]
})
export class AppModule {
}
