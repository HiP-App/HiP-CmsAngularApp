﻿import {Component, Input, OnInit} from '@angular/core';
import { Router }  from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { CmsApiService } from '../api/cms-api.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

import { MdSidenav } from '@angular2-material/sidenav';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-toolbar',
  templateUrl: './app/shared/toolbar/toolbar.component.html',
  styleUrls: ['./app/shared/toolbar/toolbar.component.css'],
  providers: [UserService, CmsApiService]
})
export class ToolbarComponent implements OnInit {
  @Input() start = MdSidenav;
  @Input() sidenavOpened = false;

  // Translate: Variables to hold language array and currently translated text
  public translatedText: string;
  public supportedLanguages: any[];

  title = 'HiPCMS';
  notifications = [
    {
      'id': '123',
      'link': 'MyTopics',
      'title': 'Re: meeting',
      'message': 'I will be there at 10. Would be nice to see you there.I bring coffee and cookies.'
    },
    {
      'id': '122',
      'link': 'MyTopics',
      'title': 'you were mentioned',
      'message': 'bjorn mentioned you in "Domplatz"'
    },
    {
      'id': '111',
      'link': 'MyTopics',
      'title': 'you got a Grade',
      'message': 'your text "Paderquellgebiet" was graded'
    }
  ];

  // Translate: Defining Supported Languages
  supportedLangs = [
      { active: false, display: 'EN', value: 'en' },
      { active: true, display: 'DE', value: 'de' },
  ];

  loggedIn: boolean;
  username = '';
  private currentUser: User;
  private errorMessage: any;

  constructor(private router: Router, private authService: AuthService,
      private userService: UserService, private translate: TranslateService) {
    this.router = router;
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
        data => this.currentUser = <User> data,
        error => this.errorMessage = <any> error
      );
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}