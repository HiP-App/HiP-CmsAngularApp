import { Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';

@Component({
    selector: 'hip-contact',
    template: `
        <md-card class="topics">
        </md-card>
        `,
    directives: [MdCard]
})
export class ContactComponent {
}
