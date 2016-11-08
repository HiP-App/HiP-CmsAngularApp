import { Component, Input, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { MdSidenav } from '@angular/material';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { TranslateService } from 'ng2-translate';

import { AuthService } from '../core/auth/auth.service';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user.model';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'hip-toolbar',
  templateUrl: './app/toolbar/toolbar.component.html',
  styleUrls: ['./app/toolbar/toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() start = MdSidenav;
  @Input() sidenavOpened = false;

  // Translate: Defining Supported Languages
  supportedLangs = [
    { active: false, display: 'EN', value: 'en' },
    { active: true, display: 'DE', value: 'de' },
  ];

  loggedIn: boolean;
  username = '';
  private currentUser: User;
  private errorMessage: any;
  private numberOfUnreadNotifications: number;
  
  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.router = router;

    // Subscribe to notification count changes.
    this.notificationService.NotificationCountAnnounced$.subscribe(
      (decrease : number) => {
        this.numberOfUnreadNotifications = this.numberOfUnreadNotifications - decrease;
      }
    );

    // Regular check for new updates
    IntervalObservable.create(60000).subscribe(
      (x: any) => {
        this.updateNotificationsCount();
      }
    );
  }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.addListener(this);
    this.currentUser = User.getEmptyUser();
    this.onChange();

    // Translate: set default language
    this.translate.use('de');
  }

  // Translate: check if the selected lang is current lang
  isCurrentLang(lang: string) {
      return lang === this.translate.currentLang;
  }

  // Translate: Language Toggler with respect to selected language
  selectLang() {
      for (let lang of this.supportedLangs) {
          lang.active = !lang.active;
          if (lang.active) {
              this.translate.use(lang.value);
          }
      }
      this.refreshText();
  }

  // Translate: Refresh translation when language change. This is used if Translate service is used instead of Pipe
  refreshText() {
      // this.translatedText = this.translate.instant('hello world');
  }

  onChange() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent().then(
        (data: any) => this.currentUser = <User> data,
        (error: any) => this.errorMessage = <any> error.error
      );
      
      this.updateNotificationsCount();
    }
  }
  
  private updateNotificationsCount() {
    this.notificationService.getUnreadNotificationsCount()
      .then(
        (response: any) => this.numberOfUnreadNotifications = response
      ).catch(
        (error: any) => console.log(error)
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
