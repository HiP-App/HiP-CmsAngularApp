﻿import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { User } from '../shared/user/user.model';

@Pipe({
    name: 'usersFilter'
})

@Injectable()

export class UsersFilter implements PipeTransform {
    transform(users: User[], query: string, criterium: string): User[] {
        if (query !== undefined) {
            //if (criterium === 'First Name') {
            //    return users.filter(user =>
            //        (user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1));
            //}
            //else if (criterium === 'Last Name' || criterium === undefined) {
            //    return users.filter(user =>
            //        (user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1));
            //}
            //else if (criterium === 'Email') {
            if (criterium === 'Email') {
                return users.filter(user =>
                    (user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1));
            }
            else if (criterium === 'Role') {
                return users.filter(user =>
                    (user.role.toLowerCase().indexOf(query.toLowerCase()) !== -1));
            }
        }
        else {
            return users;
        }
    }
}