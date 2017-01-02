import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdIconRegistry } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { routing, appRoutingProviders } from './app.routing';
import { AdminModule } from './admin/admin.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EqualValidatorDirective } from './authentication/signup/equal-validator.directive';
import { FooterModule } from './footer/footer.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TagModule } from './tag-management/tag.module';
import { TopicModule } from './topics/topics.module';
import { UserProfileModule } from './userprofile/userprofile.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    routing,
    AdminModule,
    AuthenticationModule,
    CoreModule,
    DashboardModule,
    FooterModule,
    NotificationsModule,
    TagModule,
    TopicModule,
    UserProfileModule
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
export class AppModule {}
