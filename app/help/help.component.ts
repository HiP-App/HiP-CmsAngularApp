import { Component } from '@angular/core';
import { MdCard } from '@angular2-material/card';
import {AutocompleteComponent} from '../shared/autocomplete/autocomplete.component';
 
@Component({
    selector: 'hip-help',
    template: `
        <md-card class="topics">

        <hip-autocomplete> </hip-autocomplete>
        </md-card>
        `,
    directives: [MdCard, AutocompleteComponent]
})
export class HelpComponent {
}




