import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-user-tag-input',
  templateUrl: 'user-tag-input.component.html',
  styles: [`
    .dropdown-item {
      height: 12px;
      margin-top: -4px;
    }
    .tag {
      height: 32px;
      display: flex;
      align-items: center;
    }
`]
})
export class UserTagInputComponent implements OnInit, OnChanges {
  public errorMessage: any;       // Handling error message
  public tagPlaceholder: string;  // The Placeholder for each Tag

  @Input() role: string = '';          // User role Passed dynamically
  @Input() users: User[];         // List of Users added to tag-input
  @Input() placeholder: string = 'User';   // Input for Placeholder
  @Input() maxItems: number = 90;      // Maximum Items for TagInut
  @Input() readonly: false;
  @Output() usersChange = new EventEmitter<User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.tagPlaceholder = ' +' + this.role;
  }

  ngOnChanges() {
    this.getPictures();
  }

  getPictures() {
    for (let user of this.users) {
      if (user.picture === undefined) {
        user.picture = 'loading';
        this.userService.getPicture(user.email)
          .then((response: any) => {
            user.picture = response.json().base64;
          });
      }
    }
  }

  updateData() {
    this.usersChange.emit(this.users);
  }

  requestAutoCompleteItems = (search: string): Observable<User[]> => {
    return Observable.fromPromise(this.userService.getUsers(search, this.role)
      .then(
        (users: User[]) => {
          for (let user of users) {
            if (user.picture === undefined) {
              user.picture = 'loading';
              this.userService.getPicture(user.email)
                .then((response: any) => {
                  user.picture = response.json().base64;
                });
            }
          }
          return users;
        }
      ));
  };
}
