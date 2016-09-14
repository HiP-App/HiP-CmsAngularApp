﻿import { Component, Input } from '@angular/core';
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

    public students: number[] = []; // List of Students selected
    public supervisors: number[] = []; // List of Students selected
    public reviewer: number[] = []; // List of Students selected
    public errorMessage: any;       // Handling error message
    public names: string[] = [];    // AutoComplete List
    @Input() role: string;
    @Input() users: User[];

    constructor(private userService: UserService) {
    }

    public options = {
        placeholder: '+ Tag'
    };


    /**
     * Callback for Adding Users from Auto complete List
     * @param item represents the tag which is being added(by clicking enter or by mouse from dropdown)
     */
    public onAdd(item: any) {
        this.userService.getUserId(item).then(
            data => this.setId(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
        );
    }

    public setId(userlist: User[]) {
        for (let user of userlist) {
            this.users.push(user);
        }
    }


    /**
     * Callback for Removing Users from Tag input
     * @param item represents the tag which is being removed
     */
    public onRemove(item: any) {
        this.userService.getUserId(item).then(
            data => this.unsetId(<User[]>data))
            .catch(
            error => this.errorMessage = <any>error
         );
    }

    public unsetId(userlist: User[]) {
        for (let user of userlist) {
            this.users.splice(this.users.indexOf(user), 1);
        }
        //console.log(this.users);
    }


    /**
     * Callback when selecting a tag
     * @param item represents the tag which is being currently selected
     */
    public onSelect(item: any) {
        console.log(item + ' selected');
    }


    /**
     * Method which gets triggered on keyup i.e., when user tries to enter something on input
     * @param event represents the keyup event
     * Updates the list this.names which is fed to auto complete to have dynamic entries
     */
    public updateStudentList(event: any) {
       if (event.target.value.length <= 2 || event.keyCode === 40 || event.keyCode === 38) {
           return;
        }
        this.userService.getUserNames(event.target.value, this.role).then(
           data => this.getNames(<User[]>data))
           .catch(
           error => this.errorMessage = <any>error
       );
    }

    public getNames(users: User[]) {
        this.names = [];
        for (let user of users) {
            this.names.push(user.email);
        }
        //console.log(this.names);
    }

    public errorMessages = {
        'startsWithAt@': 'Your items need to start with "@"',
        'endsWith$': 'Your items need to end with "$"'
    };


    /**
     * Callbacks for Focus and Blur
     * @param $event
     */
    public onBlur($event: any) {
        console.log("blur");
    }

    public onFocus($event: any) {
        console.log("focus");
    }

    ngOnInit() {
    }
}

export default TagInputComponent;