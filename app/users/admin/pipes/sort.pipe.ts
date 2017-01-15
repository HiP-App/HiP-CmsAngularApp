import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { User } from '../../../core/user/user.model';

@Pipe({
  name: 'hipUsersSorter'
})
@Injectable()
export class UsersSorter implements PipeTransform {
  transform(users: any, key: string, direction: number): User[] {
    if (key !== '' && users !== null) {
      users.sort(
        (a: any, b: any) => {
          if (a[key] < b[key]) {
            return -1 * direction;
          } else if (a[key] > b[key]) {
            return 1 * direction;
          } else {
            return 0;
          }
        }
      );
    }
    return users;
  }
}
