import { Component } from '@angular/core';

import {
    Validators,
    FormGroup,
    FormControl
} from '@angular/forms';

@Component({
    selector: 'hip-taginput',
    templateUrl: './app/shared/taginput/taginput.component.html'
})
class TagInputComponent {
    public items = ['Typescript', 'Angular2'];

    public options = {
        readonly: undefined,
        placeholder: '+ Tag'
    };

    public onAdd(item: any) {
        console.log(item + ' added');
    }

    public onRemove(item: any) {
        console.log(item + ' removed');
    }

    public onSelect(item: any) {
        console.log(item + ' selected');
    }

    public transform(item: string): string {
        return `@${item}`;
    }

    public updateList(event: any) {
        console.log(event.target.value);
        //Service call to fetch Users will go here
        //this.items gets updated here
        /*this.homeService.getUsers().then(
            data => this.getEmails(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
        ); */

    }

    private startsWithAt(control: FormControl) {
        if (control.value.charAt(0) !== '@') {
            return {
                'startsWithAt@': true
            };
        }


        return null;
    }

    private endsWith$(control: FormControl) {
        if (control.value.charAt(control.value.length - 1) !== '$') {
            return {
                'endsWith$': true
            };
        }

        return null;
    }

    public validators = [this.startsWithAt, this.endsWith$];

    public errorMessages = {
        'startsWithAt@': 'Your items need to start with "@"',
        'endsWith$': 'Your items need to end with "$"'
    };

    public submitForm() {
        //console.log(this.form);
        console.log(this);
        console.log('submitted')
    }

    private minimumLength(control: FormControl) {
        if (!control.value.length) {
            return {
                'minimumLength': true
            };
        }

        return undefined;
    }

    public onBlur($event: any) {
        console.log("blur");
    }

    public onFocus($event: any) {
        console.log("focus");
    }

    constructor() { }

    ngOnInit() {
        // creating form
    }
}

export default TagInputComponent;