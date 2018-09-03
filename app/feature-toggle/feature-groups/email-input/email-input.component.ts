import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-email-input',
  templateUrl: 'email-input.component.html',
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
    .list-item {
      font-size: 15px;
    }
    .close {
      padding-top: 12px;
    }
    ng2-dropdown-menu {
      width: 420px !important;
    }

    .ng2-menu-item {
      width: 420px !important;
    }

`]
})
export class EmailInputComponent implements OnChanges, OnInit {
  public errorMessage: any;       // Handling error message
  public onlyIds: string[] = [];

  @Input() users: User[];         // List of Users added to tag-input
  @Input() usersIds: string[] = []; // ids
  @Input() placeholder = 'emails';  // label
  @Input() secondaryPlaceholder = 'add email';  // label if no items set
  @Input() maxItems = 90;         // Maximum Items for TagInput
  @Input() readonly: false;
  @Output() usersChange = new EventEmitter<String[]>();

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    Object.assign(this.users, this.readonly);
  }

  ngOnChanges() {
    this.users = [];
    if (this.usersIds.length) {
      this.userService.getUsers({
        includeOnly: this.usersIds
      }).then((fetchedUsers: User[]) => {
        this.usersIds.forEach((userId) => {
          let _user = fetchedUsers.find((user) => {
            return user.id === userId;
          });
          if (_user === undefined) {
            let emptyUser = User.getEmptyUser();
            emptyUser.id = userId;
            emptyUser.email = userId;
            this.users.push(emptyUser);
          } else {
            this.users.push(_user);
          }
        });
      });
    }
  }

  updateData() {
    this.onlyIds = [];
    this.users.forEach((user) => {
      this.onlyIds.push(user.id);
    });
    this.usersChange.emit(this.onlyIds);
    Object.assign(this.users, this.readonly);
  }

  requestAutoCompleteItems = (search: string): Observable<User[]> => {
    return Observable.fromPromise(this.userService.getUsers({
      emailId: search
    })
      .then(
        (users: User[]) => {
          return users;
        }
      ));
  }
}
