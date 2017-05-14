import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdIconRegistry } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { routing, appRoutingProviders } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { FooterModule } from './footer/footer.module';
import { MobileContentModule } from './mobile-content/mobile-content.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SharedModule } from './shared/shared.module';
import { TagModule } from './tag-management/tag.module';
import { TopicModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    AuthenticationModule,
    DashboardModule,
    FooterModule,
    MobileContentModule,
    NotificationsModule,
    SharedModule,
    TagModule,
    TopicModule,
    UsersModule
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
    MdIconRegistry
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
