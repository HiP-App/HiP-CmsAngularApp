import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/user/user.service';
import { TranslateService } from 'ng2-translate';
import { NotificationService } from './notifications/notification.service';
import { User } from './core/user/user.model';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  moduleId: module.id,
  selector: 'hip-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {

  // Translate: Defining Supported Languages
  supportedLangs = [
    {active: false, display: 'EN', value: 'en'},
    {active: true, display: 'DE', value: 'de'},
  ];

  loggedIn: boolean;
  menuOpen: boolean = false;

  opened = false;
  mode = 'side';
  navigation: any[] = [];
  hipCopyright = 'HiP CMS';

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
      'name': 'All Topics'
    },
    {
      'link': '/all-tags',
      'name': 'Tags'
    },
    {
      'link': '/annotation',
      'name': 'Text Annotation'
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

  private currentUser: User;
  private errorMessage: any;
  private numberOfUnreadNotifications: number;

  constructor(public ngZone: NgZone,
              private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private translate: TranslateService,
              private notificationService: NotificationService) {
    this.router = router;

    // Subscribe to notification count changes.
    this.notificationService.NotificationCountAnnounced$.subscribe(
      (decrease: number) => {
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
