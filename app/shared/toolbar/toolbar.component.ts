import { Component, Input } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdSidenav } from '@angular2-material/sidenav';

@Component({
    selector: 'hip-toolbar',
    viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
    templateUrl: './app/shared/toolbar/toolbar.component.html',
    directives: [MdToolbar, MdButton, MdIcon]
})
export class ToolbarComponent {
    @Input()
    start = MdSidenav;
    title = 'HiPCMS';
    topnav = [
        {
            'href': '/contact/',
            'name': 'contact'
        },
        {
            'href': '/help/',
            'name': 'help'
        },
        {
            'href': '/about/',
            'name': 'about'
        }
    ];
}
