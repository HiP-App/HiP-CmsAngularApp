import { Component, NgZone, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { MdButton } from '@angular2-material/button';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ToolbarComponent } from './../toolbar/toolbar.component';
import { FooterComponent } from './../footer/footer.component';
import { AuthService } from '../auth/auth.service';
import { AdminComponent } from '../../admin/admin.component';
import { ToasterContainerComponent, ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../user/user.service';

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
    AdminComponent,
    ROUTER_DIRECTIVES,
    ToasterContainerComponent
  ],
  providers: [ToasterService]
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
    }
  ];
  supervisorNavigation = [
    {
      'link': '/new-topic',
      'name': 'New Topic'
    },
    {
      'link': '/all-topics',
      'name': 'All Topics'
    }
  ];
  adminNavigation = [
    {
      'link': '/admin',
      'name': 'Admin'
    }
  ];

  constructor(public ngZone: NgZone, private authService: AuthService, private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.isOpened();
    this.addAdditionalMenu();
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

  addAdditionalMenu() {
    this.userService.getCurrent().then(
      user => {
        if (user.role === 'Supervisor') {
          for (let element of this.supervisorNavigation) {
            this.navigation.push(element);
          }
        }
        if (user.role === 'Administrator') {
          for (let element of this.adminNavigation) {
            this.navigation.push(element);
          }
        }
      }
    );
  }
}
