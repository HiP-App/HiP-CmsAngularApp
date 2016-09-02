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
