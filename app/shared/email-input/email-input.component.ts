import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { User } from '../../users/user.model';
import { UserService } from '../../users/user.service';

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
`]
})
export class EmailInputComponent implements OnChanges {
  public errorMessage: any;       // Handling error message
  public tagPlaceholder: string;  // The Placeholder for each Tag
  public onlyEmails: string[] = [];

  @Input() users: User[];         // List of Users added to tag-input
  @Input() usersIds: string[] = []; // ids
  @Input() placeholder = 'User';  // Input for Placeholder
  @Input() maxItems = 90;         // Maximum Items for TagInput
  @Input() readonly: false;
  @Output() usersChange = new EventEmitter<String[]>();

  constructor(private userService: UserService) {}

  ngOnChanges() {
    if (this.usersIds) {
      let users: User[] = [];
      for (let userId of this.usersIds) {
        let user = User.getEmptyUser();
        user.identity = userId;
        user.email = userId;
        users.push(user);
      }
      this.users = users;
    }
  }

  updateData() {
    this.onlyEmails = [];
    for (let k = 0; k < this.users.length; k++) {
      this.onlyEmails.push(this.users[k].email);
    }
    this.usersChange.emit(this.onlyEmails);
  }

  requestAutoCompleteItems = (search: string): Observable<User[]> => {
    return Observable.fromPromise(this.userService.getUsers(search, '')
      .then(
        (users: User[]) => {
          return users;
        }
      ));
  }
}
