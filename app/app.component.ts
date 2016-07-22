import { Component } from '@angular/core';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HIP_ROUTER_PROVIDERS } from './app.routes';

@Component({
  selector: 'hip-app',
  template: '<hip-sidenav></hip-sidenav>',
  directives: [DashboardComponent, SidenavComponent],
  providers: []
})
export class AppComponent {
}
