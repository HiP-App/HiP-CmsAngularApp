import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user.model';
import { UsersFilter } from './filter.pipe';
import { UsersSorter } from './sort.pipe';

@Component({
    selector: 'hip-users-list',
    templateUrl: '../app/admin/users-list.component.html',
    providers: [UserService],
    directives: [],
    pipes: [UsersFilter, UsersSorter]
})

export class UsersListComponent implements OnInit {

    public users: User[];
    public errorMessage: any;
    public query: string = '';
    public key: string = '';
    public direction: number = -1;
    public roles = ['Student', 'Supervisor', 'Administrator'];
    public options = ['Last Name', 'First Name', 'Email', 'Role'];


    constructor(private userService: UserService) {
        this.getUsers();
    }

    ngOnInit(): any {
        this.getUsers();
    }

    getUsers() {
        this.userService.getAll().then(
            data => this.users = <User[]>data)
            .catch(
            error => this.errorMessage = <any>error
            );
    }

    changeRole(selectedRole: string, user: User) {
        alert(user.firstName + ': \nOld role: ' + user.role + '\nNew role: ' + selectedRole);
    }

    sort(value: string) {
        this.direction = this.direction * (-1);
        this.key = value;
    }

}