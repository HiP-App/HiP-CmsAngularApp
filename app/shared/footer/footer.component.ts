import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

@Component({
    selector: 'hip-footer',
    templateUrl: './app/shared/footer/footer.component.html',
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
