import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { User } from '../core/user/user.model';

@Pipe({
  name: 'hipUsersFilter'
})

@Injectable()

export class UsersFilter implements PipeTransform {
  transform(users: User[], query: string, criterium: string): User[] {
    if (query !== '' && query !== undefined && users !== null) {
      if (criterium === 'First Name') {
        return users.filter(user =>
          (user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1));
      } else if (criterium === 'Last Name') {
        return users.filter(user =>
          (user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1));
      } else if (criterium === 'Email' || criterium === undefined) {
        return users.filter(user =>
          (user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1));
      } else if (criterium === 'Role') {
        return users.filter(user =>
          (user.role.toLowerCase().indexOf(query.toLowerCase()) !== -1));
      }
    } else {
      return users;
    }
  }
}
