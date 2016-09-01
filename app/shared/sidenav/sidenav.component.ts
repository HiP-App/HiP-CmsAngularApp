import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ToolbarComponent } from './../toolbar/toolbar.component';
import { FooterComponent } from './../footer/footer.component';
import { AuthService } from '../auth/auth.service';
import { AdminComponent } from '../../admin/admin.component';
import { ToasterContainerComponent, ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserService } from '../user/user.service';

@Component({
  selector: 'hip-app',
  templateUrl: './app/shared/sidenav/sidenav.component.html',
  styleUrls: ['./app/shared/sidenav/sidenav.component.css'],
  directives: [
    DashboardComponent,
    ToolbarComponent,
    FooterComponent,
    AdminComponent,
    ToasterContainerComponent
  ],
  providers: [ToasterService]
})
export class SidenavComponent implements OnInit {
  opened = false;
  mode = 'side';
  additionalMenuAdded = false;

  navigation: any[] = [];
  studentNavigation = [
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
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.isOpened();
      });
    };
    this.router.events.subscribe(() => {
      this.isOpened();
      this.addAdditionalMenu();
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
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.userService.getCurrent().then(
      user => {
        this.navigation = [];
        if (user.role === 'Student' || user.role === 'Supervisor' || user.role === 'Administrator') {
          for (let element of this.studentNavigation) {
            this.navigation.push(element);
          }
        }
        if (user.role === 'Supervisor' || user.role === 'Administrator') {
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
