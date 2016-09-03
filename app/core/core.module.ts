import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { HttpModule } from '@angular/http';
import { ToastModule } from 'angular2-toaster/lib/toast.module';
import { AuthHttp, provideAuth } from 'angular2-jwt';

import { AuthApiService } from './api/auth-api.service';
import { AuthGuard } from './guards/auth-guard';
import { AuthService } from './auth/auth.service';
import { CmsApiService } from './api/cms-api.service';
import { AdminGuard } from './guards/admin-guard';
import { UserService } from './user/user.service';
import { SupervisorGuard } from './guards/supervisor-guard';

@NgModule({
  imports: [
    // Api Services
    HttpModule,
    // Translations
    TranslateModule.forRoot(),
    // Toast
    ToastModule
  ],
  exports: [
    ToastModule,
    TranslateModule
  ],
  providers: [
    TranslateService,
    AuthService,
    AuthApiService,
    CmsApiService,
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
