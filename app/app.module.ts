import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdIconModule, MdListModule, MdSidenavModule, MdToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { AuthenticationModule } from './authentication/authentication.module';
import { AuthGuard } from './shared/guards/auth-guard';
import { AppComponent } from './app.component';
import { CmsApiService } from './shared/api/cms-api.service';

import { ConfigService } from './config.service';
import { FeatureService } from './feature-toggle/features/shared/feature.service';
import { FeatureToggleApiService } from './shared/api/featuretoggle-api.service';
import { NotificationService } from './notifications/notification.service';
import { ScrollService } from './shared/scroll/scroll.service';
import { SupervisorGuard } from './shared/guards/supervisor-guard';
import { routing } from './app.routing';
import { ClickOutsideModule } from 'ng4-click-outside';
import { UserStoreApiService } from './shared/api/userstore-api.service';

@NgModule({
  imports: [
    AuthenticationModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MdButtonModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdToolbarModule,
    routing,
    ToasterModule,
    ClickOutsideModule,
    TranslateModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AuthGuard,
    CmsApiService,
    UserStoreApiService,

    ConfigService,
    NotificationService,
    FeatureService,
    FeatureToggleApiService,
    ScrollService,
    SupervisorGuard,
    TranslateService,
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
