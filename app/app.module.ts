import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule, MdIconRegistry } from '@angular/material';
import { routing, appRoutingProviders } from './app.routing';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { EqualValidatorDirective } from './authentication/signup/equal-validator.directive';
import { TagModule } from './tag-management/tag.module';
import { TopicModule } from './topics/topics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { AuthenticationModule } from './authentication/authentication.module';
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
    AdminModule,
    AuthenticationModule,
    CoreModule,
    DashboardModule,
    FooterModule,
    NotificationsModule,
    TopicModule,
    UserModule,
    TagModule
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
