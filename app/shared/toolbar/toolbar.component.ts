import {Component, Input, OnInit} from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdSidenav } from '@angular2-material/sidenav';
import { MdToolbar } from '@angular2-material/toolbar';
import { Router, ROUTER_DIRECTIVES }  from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { CmsApiService } from '../api/cms-api.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Component({
  selector: 'hip-toolbar',
  viewProviders: [MdIconRegistry],
  templateUrl: './app/shared/toolbar/toolbar.component.html',
  styleUrls: ['./app/shared/toolbar/toolbar.component.css'],
  directives: [MdToolbar, MdButton, MdIcon, ROUTER_DIRECTIVES],
  providers: [UserService, CmsApiService]
})
export class ToolbarComponent implements OnInit {
  @Input() start = MdSidenav;
  @Input() sidenavOpened = false;

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
  languages = [
    {
      active: true,
      short: 'EN',
      name: 'english'
    },
    {
      active: false,
      short: 'DE',
      name: 'deutsch'
    }
  ];
  loggedIn: boolean;
  username = '';
  private currentUser: User;
  private errorMessage: any;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    this.router = router;
  }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.addListener(this);
    this.currentUser = User.getEmptyUser();
    this.onChange();
  }

  onChange() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.loggedIn) {
      this.userService.getCurrent().then(
        data => this.currentUser = <User> data,
        error => this.errorMessage = <any> error
      );
      console.log(this.currentUser);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleLang() {
    for (let lang of this.languages) {
      lang.active = !lang.active;
    }
    this.userService.getCurrent();
  };
}
