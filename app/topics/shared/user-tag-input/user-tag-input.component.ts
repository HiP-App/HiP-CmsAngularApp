import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';

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

  @Input() role = '';             // User role Passed dynamically
  @Input() users: User[];         // List of Users added to tag-input
  @Input() usersIds: string[] = []; // ids
  @Input() placeholder = 'User';  // Input for Placeholder
  @Input() maxItems = 90;         // Maximum Items for TagInput
  @Input() readonly: false;
  @Output() usersChange = new EventEmitter<User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.tagPlaceholder = ' +' + this.role;
    Object.assign(this.users, this.readonly);
  }

  ngOnChanges() {
    if (this.usersIds) {
      let users: User[] = [];
      for (let userId of this.usersIds) {
        let user = User.getEmptyUser();
        user.id = userId;
        user.email = userId;
        users.push(user);
      }
    }
    this.getPictures();
  }

  getPictures() {
    for (let user of this.users) {
      if (user.picture === undefined) {
        user.picture = 'loading';
        this.userService.getPicture(user.email, true, true)
          .then((response: any) => {
            user.picture = response.json().base64;
          });
      }
    }
  }

  updateData() {
    this.usersChange.emit(this.users);
    Object.assign(this.users, this.readonly);
  }

  requestAutoCompleteItems = (search: string): Observable<User[]> => {
    return Observable.fromPromise(this.userService.getUsers(search, this.role)
      .then(
        (users: User[]) => {
          for (let user of users) {
            if (user.picture === undefined) {
              user.picture = 'loading';
              this.userService.getPicture(user.email, true, true)
                .then((response: any) => {
                  user.picture = response.json().base64;
                }).catch(
                (error: any) => console.error(error)
              );
            }
          }
          return users;
        }
      ));
  }
}
