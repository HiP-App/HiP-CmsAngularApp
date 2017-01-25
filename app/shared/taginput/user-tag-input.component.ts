import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';

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
`]
})
export class UserTagInputComponent implements OnInit {
  public errorMessage: any;       // Handling error message
  public names: string[] = [];    // AutoComplete List
  public tagPlaceholder: string;  // The Placeholder for each Tag
  public errorMessages = {
    'required': 'At least one user is required'
  };
  public foundUsers: TagUser[] = [];
  @Input() role: string;          // User role Passed dynamically
  @Input() users: User[];         // List of Users added to tag-input
  @Input() placeholder: string;   // Input for Placeholder
  @Input() maxItems: number;      // Maximum Items for TagInut
  @Output() usersChange = new EventEmitter<User[]>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.tagPlaceholder = ' +' + this.role;
  }

  updateData() {
    this.usersChange.emit(this.users);
  }

  /**
   * Callback for Adding Users from Auto complete List
   * @param item represents the tag which is being added(by clicking enter or by mouse from dropdown)
   */
  public onAdd(item: any) {
    this.users.push(this.foundUsers
      .find(
        (user: User) => {
          return user.email === item.value;
        })
    );
    this.updateData();
  }

  /**
   * Callback for Removing Users from Tag input
   * @param item represents the tag which is being removed
   */
  public onRemove(item: any) {
    this.userService.getUserByEmail(item.email)
      .then(
        (data: any) => this.unsetUser(<User[]>data)
      ).catch(
        (error: any) => this.errorMessage = <any>error.error
      );
  }

  public unsetUser(userlist: User[]) {
    for (let user of userlist) {
      this.users = this.users.filter(
        (item: User) => item.id !== user.id
      );
    }
    this.updateData();
  }

  /**
   * Method which gets triggered on keyup i.e., when user tries to enter something on input
   * @param event represents the keyup event
   * Updates the list this.names which is fed to auto complete to have dynamic entries
   */
  public updateUserList(event: any) {
    if (typeof event.target.value === 'undefined') {
      return;
    }
    if (event.target.value.length <= 2 || event.keyCode === 40 || event.keyCode === 38) {
      return;
    }
    this.userService.getUserNames(event.target.value, this.role)
      .then(
        (data: any) => this.getNames(<User[]>data)
      ).catch(
        (error: any) => this.errorMessage = <any>error.error
      );
  }

  public getNames(users: User[]) {
    this.foundUsers = [];
    this.names = [];
    for (let user of users) {
      if (this.users.find(
        (u: User) => {
          return u.id === user.id;
        }) === undefined) {
        this.foundUsers.push(new TagUser(user));
      }
    }
  }

}

class TagUser extends User {
  public value: string;
  public display: string;

  constructor(user: User) {
    super(user.id, user.email, user.firstName, user.lastName, user.role, user.fullName);
    this.value = this.email;
    this.display = this.email;
  }
}
