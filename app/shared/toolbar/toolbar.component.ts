import { Component, Input } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdSidenav } from '@angular2-material/sidenav';

@Component({
  selector: 'hip-toolbar',
  viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
  templateUrl: './app/shared/toolbar/toolbar.component.html',
  styleUrls: ['./app/shared/toolbar/toolbar.component.css'],
  directives: [MdToolbar, MdButton, MdIcon, ROUTER_DIRECTIVES]
})
export class ToolbarComponent {
  @Input()
  start = MdSidenav;
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

  toggleLang() {
    for (let lang of this.languages) {
      lang.active = !lang.active;
    }
  };
}
