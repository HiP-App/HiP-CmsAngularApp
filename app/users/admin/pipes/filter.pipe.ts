import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { User } from '../../../core/user/user.model';

@Pipe({
  name: 'hipUsersFilter'
})
@Injectable()
export class UsersFilter implements PipeTransform {
  transform(users: User[], query: string, criterion: string, role: string): User[] {
    if (query !== '' && query !== undefined && users !== null) {
      if (criterion === 'First Name') {
        users = users.filter(
          user => (user.firstName != null && user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      } else if (criterion === 'Last Name') {
        users = users.filter(
          user => (user.lastName != null && user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      } else if (criterion === 'Email' || criterion === undefined) {
        users = users.filter(
          user => (user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
      }
    }
    if (role !== 'all') {
      users = users.filter(
        user => (user.role === role)
      );
    }
    return users;
  }
}
