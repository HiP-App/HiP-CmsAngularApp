import { Component } from '@angular/core';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

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
    public students: number[] = [];
    public users: User[] = [];
    public errorMessage: any;
    public names: string[] = [];

    constructor(private userService: UserService) {
    }

    public options = {
        placeholder: '+ Tag'
    };

    public onAdd(item: any) {
        this.userService.getUserId(item).then(
            data => this.setId(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
        );
    }

    setId(users: User[]) {
        for (let user of users) {
            this.students.push(user.id);
        }
        console.log(this.students);
    }

    public onRemove(item: any) {
        this.userService.getUserId(item).then(
            data => this.unsetId(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
         );
    }

    unsetId(users: User[]) {
        for (let user of users) {
            this.students.splice(this.students.indexOf(user.id), 1);
        }
        console.log(this.students);
    }

    public onSelect(item: any) {
        console.log(item + ' selected');
    }

    public transform(item: string): string {
        return `@${item}`;
    }

    public updateStudentList(event: any) {
        if (event.target.value.length <= 2 || event.keyCode === 40 || event.keyCode === 38) {
            return;
        }
        this.userService.getUserNames(event.target.value, "Student").then(
            data => this.getNames(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
        );
    }

    getNames(users: User[]) {
        this.names = [];
        for (let user of users) {
            this.names.push(user.email);
        }
        console.log(this.names);
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

    ngOnInit() {
        // creating form
    }
}

export default TagInputComponent;