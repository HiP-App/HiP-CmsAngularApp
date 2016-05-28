import {Component, ViewEncapsulation} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdCard} from '@angular2-material/card';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MdList, MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdSidenav, MdSidenavLayout} from '@angular2-material/sidenav';
import {ContentComponent} from "./content.component";

@Component({
    selector: 'my-app',
    viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
    templateUrl: 'templates/app-component.html',
    directives: [MdToolbar, MdButton, MdCard, MdList, MD_LIST_DIRECTIVES, MdSidenav, MdSidenavLayout, MdIcon, ContentComponent]
})
export class AppComponent {
    title = 'HiPCMS';
    navigation = [
        'Dashboard',
        'My topics',
        'My groups',
        'Private messages',
        'My profile'
    ];
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
    ]

}
