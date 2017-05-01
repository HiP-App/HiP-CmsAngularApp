import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule, TranslateService } from 'ng2-translate';

@NgModule({
  imports: [
    HttpModule,
    NgxPaginationModule,
    RouterModule,
    TranslateModule.forRoot(),
    ToasterModule
  ],
  exports: [
    ToasterModule,
    TranslateModule,
    NgxPaginationModule
  ],
  providers: [
    TranslateService,
    ToasterService
  ]
})
export class CoreModule {
  // Prevent importing core module in lazy loaded modules
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
