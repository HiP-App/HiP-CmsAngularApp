import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth/auth.service';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'hip-app',
  templateUrl: './app/sidenav/sidenav.component.html',
  styleUrls: ['./app/sidenav/sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  opened = false;
  mode = 'side';
  navigation: any[] = [];

  private studentNavigation = [
    {
      'link': '/dashboard',
      'name': 'Dashboard'
    },
    {
      'link': '/notifications',
      'name': 'Notifications'
    },
    {
      'link': '/my-topics',
      'name': 'My Topics'
    },
    {
      'link': '/all-topics',
      'name': 'all topics'
    }
  ];
  private supervisorNavigation = [
    {
      'link': '/new-topic',
      'name': 'New Topic'
    },
  ];
  private adminNavigation = [
    {
      'link': '/admin',
      'name': 'Admin'
    }
  ];

  constructor(public ngZone: NgZone,
              private authService: AuthService,
              private userService: UserService,
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
      this.buildMenu();
    });
  }

  private isOpened() {
    this.opened = false;
    if (this.authService.isLoggedIn()) {
      this.opened = window.innerWidth > 1300;
    }
    this.mode = this.opened ? 'side' : 'push';
  }

  private buildMenu() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    Promise.all([this.userService.currentUserCanCreateTopics(), this.userService.currentUserCanAdminister()])
      .then(response => {
        let [canCreate, canAdmin] = response;
        this.navigation = [];

        for (let element of this.studentNavigation) {
          this.navigation.push(element);
        }

        if (canCreate) {
          for (let element of this.supervisorNavigation) {
            this.navigation.push(element);
          }
        }

        if (canAdmin) {
          for (let element of this.adminNavigation) {
            this.navigation.push(element);
          }
        }
      })
      .catch(error => console.log('Failed to load permissions: ' + error.error));
  }
}
