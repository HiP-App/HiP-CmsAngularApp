import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MdButtonModule, MdIconModule, MdListModule, MdSidenavModule, MdToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { appRoutingProviders, routing } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { NotificationService } from './notifications/notification.service';
import { ScrollService } from './shared/scroll/scroll.service';

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
    TranslateModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    appRoutingProviders,
    ConfigService,
    NotificationService,
    ScrollService,
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
