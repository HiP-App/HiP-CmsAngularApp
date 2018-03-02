import { Component, NgZone, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import { AuthServiceComponent } from './authentication/auth.service';
import { NotificationService } from './notifications/notification.service';
import { ScrollService } from './shared/scroll/scroll.service';
import { User } from './users/user.model';
import { UserService } from './users/user.service';


@Component({
  moduleId: module.id,
  selector: 'hip-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {

  // Translate: Defining Supported Languages
  supportedLangs = [
    {active: false, display: 'EN', value: 'en'},
    {active: true, display: 'DE', value: 'de'},
  ];

  loggedIn: boolean;
  menuOpen = false;
  url = '';
  windowflag = false;

  canCreate = false;
  canAdmin = false;

  opened = false;
  mode = 'side';
  hipCopyright = '© ' + new Date().getFullYear() + ' HiP CMS';

  isScrollListenerAdded = false;
  @ViewChild('wrapper') wrapper: ElementRef;

  private currentUser: User;
  private errorMessage: any;
  private numberOfUnreadNotifications: number;
  private uploadedImage = '';

  constructor(public ngZone: NgZone,
              private router: Router,
              private authService: AuthServiceComponent,
              private userService: UserService,
              private translate: TranslateService,
              private notificationService: NotificationService,
              private scrollService: ScrollService) {
    this.router = router;

    // Subscribe to notification count changes.
    this.notificationService.notificationCountAnnounced$.subscribe(
      (decrease: number) => {
        this.numberOfUnreadNotifications = this.numberOfUnreadNotifications - decrease;
      }
    );

    /*
     * when this comp. is called (e.g. on page load / redirect),
     * order the authService to check wether the user has authenticated:
     */
    authService.handleAuthentication()
      .then(() => {
        this.onChange();
      }).catch(err => {
        if (err.errorDescription === AuthServiceComponent.ERR_ACCOUNT_NOT_ENABLED) {
          // TODO: Display error as a popup or sth like that
          console.error(err.errorDescription);
        } else if (err.errorDescription === AuthServiceComponent.ERR_EMAIL_NOT_CONFIRMED) {
          // TODO: Display error as a popup or sth like that
          console.error(err.errorDescription);
        } else {
          console.error(err);
        }
      });

    // Regular check for new updates
    IntervalObservable.create(60000).subscribe(
      (x: any) => {
        this.updateNotificationsCount();
      }
    );
  }

  ngOnInit() {
    this.browserLanguage();
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.addListener(this);
    this.currentUser = User.getEmptyUser();
    this.onChange();

    // Translate: set default language
    this.translate.use('en');

    this.isOpened();
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.isOpened();
      });
    };
    this.router.events.subscribe((data: NavigationStart) => {
      this.url = data.url;
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

  private toggle(start: any) {
    if (window.innerWidth < 1300) {
      start.toggle();
    } else {
      return false;
    }
  }

  private browserLanguage() {
    let language =  window.navigator.language.toLowerCase();
    if (language.indexOf('de') !== -1) {
      this.translate.use('de');
    }
  }

  private buildMenu() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    Promise.all([this.userService.currentUserCanCreateTopics(), this.userService.currentUserCanAdminister()])
      .then(
        (response: any) => {
          let [canCreate, canAdmin] = response;
          this.canCreate = canCreate;
          this.canAdmin = canAdmin;
        }
      ).catch(
        (error: any) => console.error('Failed to load permissions: ' + error.error)
      );
  }

  ngAfterViewChecked() {
    if (!this.isScrollListenerAdded) {
      this.wrapper.nativeElement.parentElement.addEventListener('scroll', (event: any) => {
        this.scrollService.triggerListener(event);
      });
      this.isScrollListenerAdded = true;
    }
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
  }

  onChange() {
    this.loggedIn = this.authService.isLoggedIn();
    // Get image for toolbar
    if (this.loggedIn) {
      this.userService.getCurrent()
        .then(
          (data: any) => {this.currentUser = <User> data;
            this.getUserImage(); },
          (error: any) => {this.errorMessage = <any> error.error; }
        );
      this.updateNotificationsCount();
    }
  }

  private updateNotificationsCount() {
    if (this.loggedIn) {
      this.notificationService.getUnreadNotificationsCount()
        .then(
          (response: any) => this.numberOfUnreadNotifications = response
        ).catch(
          (error: any) => console.error(error)
        );
    }
  }

  getUserImage() {
   this.userService.getPicture(this.currentUser.identity, this.currentUser.identity === undefined)
      .then(
        (response: any) => {
          if (response.status === 200) {
            this.uploadedImage = response.json().base64;
          }
        }
      ).catch(
      (error: any) => console.error(error)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
