import { Component, NgZone, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { MdButton } from '@angular2-material/button';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ToolbarComponent } from './../toolbar/toolbar.component';
import { FooterComponent } from './../footer/footer.component';
import { AuthService } from '../auth/auth.service';

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
})
export class SidenavComponent implements OnInit {
  opened = false;
  mode = 'side';

  navigation = [
    {
      'link': '/dashboard',
      'name': 'Dashboard'
    },
    {
      'link': '/my-topics',
      'name': 'My Topics'
    },
    {
      'link': '/new-topic',
      'name': 'New Topic'
    }
  ];

  constructor(public ngZone: NgZone, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isOpened();
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.isOpened();
      });
    };
    this.router.events.subscribe(() => {
      this.isOpened();
    });
  }

  isOpened() {
    this.opened = false;
    if (this.authService.isLoggedIn()) {
      this.opened = window.innerWidth > 1300;
    }
    this.mode = this.opened ? 'side' : 'push';
  }

}
