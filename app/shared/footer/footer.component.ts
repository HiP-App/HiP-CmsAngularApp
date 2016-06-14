import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

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
            'href': 'Contact',
            'name': 'Contact'
        },
        {
            'href': 'Help',
            'name': 'Help'
        },
        {
            'href': 'About',
            'name': 'About'
        }
    ];
}
