import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthHttp, provideAuth } from 'angular2-jwt';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { AdminGuard } from './guards/admin-guard';
import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { AuthService } from './auth/auth.service';
import { CmsApiService } from './api/cms-api.service';
import { OOApiService } from './api/oo-api.service';
import { SupervisorGuard } from './guards/supervisor-guard';
import { UserService } from './user/user.service';

@NgModule({
  imports: [
    HttpModule,
    Ng2PaginationModule,
    RouterModule,
    TranslateModule.forRoot(),
    ToasterModule
  ],
  exports: [
    ToasterModule,
    TranslateModule,
    Ng2PaginationModule
  ],
  providers: [
    TranslateService,
    ToasterService,
    AuthService,
    AuthApiService,
    CmsApiService,
    OOApiService,
    UserService,
    AuthGuard,
    AdminGuard,
    SupervisorGuard,
    AuthHttp,
    provideAuth({
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      tokenName: 'id_token',
      tokenGetter: (() => localStorage.getItem('id_token')),
      globalHeaders: [{ 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' }],
      noJwtError: true,
      noTokenScheme: true
    })
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
