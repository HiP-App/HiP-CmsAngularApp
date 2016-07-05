import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'hip-footer',
    templateUrl: './app/shared/footer/footer.component.html',
    styleUrls: ['./app/shared/footer/footer.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
export class FooterComponent {
    hipCopyright = 'HiP CMS';
    legal = [
        {
            'href': '/contact',
            'name': 'Contact'
        },
        {
            'href': '/help',
            'name': 'Help'
        },
        {
            'href': '/about',
            'name': 'About'
        }
    ];
}
