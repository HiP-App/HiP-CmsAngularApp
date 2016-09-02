import { Component } from '@angular/core';

@Component({
    selector: 'hip-footer',
    templateUrl: './app/footer/footer.component.html',
    styleUrls: ['./app/footer/footer.component.css']
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
