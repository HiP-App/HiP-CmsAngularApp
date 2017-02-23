import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { User } from '../../../core/user/user.model';

@Pipe({
  name: 'hipUsersSorter'
})
@Injectable()
export class UsersSorter implements PipeTransform {
  transform(users: User[], key: string, direction: number): User[] {
    if (key !== '' && users !== null) {
      users.sort(
        (a: any, b: any) => {
          let propertyA: number|string = this.getProperty(a, key);
          let propertyB: number|string = this.getProperty(b, key);

          if (propertyA < propertyB) {
            return -1 * direction;
          } else if (propertyA > propertyB) {
            return 1 * direction;
          } else {
            return 0;
          }
        }
      );
    }
    return users;
  }

  private getProperty(value: { [key: string]: any}, key: string): number|string {
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    let keys: string[] = key.split('.');
    let result: any = value[keys.shift()];
    for (let newkey of keys) {
      if (result === null) {
        return undefined;
      }
      result = result[newkey];
    }
    return result;
  }
}
