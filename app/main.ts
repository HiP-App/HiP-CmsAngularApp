import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { HIP_ROUTER_PROVIDERS } from './app.routes';
import { AuthGuard } from './shared/auth/auth-guard';
import { AuthService } from './shared/auth/auth.service';
import { ApiService } from './shared/api/api.service';

bootstrap(AppComponent, [HIP_ROUTER_PROVIDERS, HTTP_PROVIDERS, AuthGuard, AuthService, ApiService]);
