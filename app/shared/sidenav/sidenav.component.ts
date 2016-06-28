import { Component, NgZone } from '@angular/core';
import { ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MdButton } from '@angular2-material/button';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ToolbarComponent } from './../toolbar/toolbar.component';
import { FooterComponent } from './../footer/footer.component';


@Component({
  selector: 'hip-sidenav',
  templateUrl: './app/shared/sidenav/sidenav.component.html',
  styleUrls: ['./app/shared/sidenav/sidenav.component.css'],
  directives: [
    MdButton,
    MdList,
    MD_LIST_DIRECTIVES,
    MdSidenav,
    MdSidenavLayout,
    DashboardComponent,
    ToolbarComponent,
    FooterComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [ROUTER_PROVIDERS]
})
export class SidenavComponent {
  opened = false;
  mode = 'side';

  navigation = [
    {
      'link': 'Dashboard',
      'name': 'Dashboard'
    },
    {
      'link': 'MyTopics',
      'name': 'My Topics'
    }
  ];

  constructor(ngZone: NgZone) {
    this.isOpened();
    window.onresize = (e) => {
      ngZone.run(() => {
        this.isOpened();
      });
    };
  }

  isOpened() {
    this.opened = window.innerWidth > 1300;
    this.mode = this.opened ? 'side' : 'push';
  }

}
