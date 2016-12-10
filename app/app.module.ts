import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdIconRegistry } from '@angular/material';

import {
  routing,
  appRoutingProviders } from './app.routing';


import { CoreModule } from './core/core.module';
import { EqualValidatorDirective } from './authentication/signup/equal-validator.directive';

import { TopicModule } from './topics/topics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserProfileModule } from './userprofile/userprofile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppComponent } from './app.component';
import { FooterModule } from './footer/footer.module';
import { ConfigService } from './config.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    routing,

    CoreModule,
    DashboardModule,
    NotificationsModule,
    AdminModule,
    TopicModule,
    AuthenticationModule,
    UserProfileModule,
    FooterModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    appRoutingProviders,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ ConfigService ],
      multi: true,
    },
    EqualValidatorDirective,
    MdIconRegistry
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
