import { NgModule, APP_INITIALIZER } from '@angular/core';

import { appRoutingProviders, routing } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { MobileContentModule } from './mobile-content/mobile-content.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { TagModule } from './tag-management/tag.module';
import { TopicModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';

@NgModule({
  imports: [
    AuthenticationModule,
    DashboardModule,
    MobileContentModule,
    NotificationsModule,
    PagesModule,
    routing,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
