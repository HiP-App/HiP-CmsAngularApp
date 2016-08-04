import { Component, ViewEncapsulation } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdButton } from '@angular2-material/button';
import { MdCard } from '@angular2-material/card';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';

@Component({
  
    selector: 'hip-contact',
    templateUrl: './app/contact/contact.component.html',
    directives: [MdCard, MdList, MD_LIST_DIRECTIVES, MdButton, MD_INPUT_DIRECTIVES],
    viewProviders: [MdIconRegistry, HTTP_PROVIDERS],
})

export class ContactComponent {
}
