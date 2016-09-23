import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

import {
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'hip-taginput',
  templateUrl: './app/shared/taginput/taginput.component.html'
})
export class TagInputComponent {

  public errorMessage: any;       // Handling error message
  public names: string[] = [];    // AutoComplete List
  public tagPlaceholder: string;  // The Placeholder for each Tag

  @Input() usernames: string[];   // Default List, used incase of update model
  @Input() role: string;          // User role Passed dynamically
  @Input() users: number[];       // List of Users updated
  @Input() placeholder: string;   // Input for Placeholder
  @Input() maxItems: number;      // Maximum Items for TagInut
  @Output() modelChange = new EventEmitter<number[]>();

  constructor(private userService: UserService) {
  }

  /**
   * Callback for Adding Users from Auto complete List
   * @param item represents the tag which is being added(by clicking enter or by mouse from dropdown)
   */
  public onAdd(item: any) {
    this.userService.getUserId(item).then(
      data => this.setId(<User[]>data))
      .catch(
        error => this.errorMessage = <any>error
      );
  }

  public setId(userlist: User[]) {
    for (let user of userlist) {
      this.users.push(user.id);
    }
    this.modelChange.emit(this.users);
  }


  /**
   * Callback for Removing Users from Tag input
   * @param item represents the tag which is being removed
   */
  public onRemove(item: any) {
    this.userService.getUserId(item).then(
      data => this.unsetId(<User[]>data))
      .catch(
        error => this.errorMessage = <any>error
      );
  }

  public unsetId(userlist: User[]) {
    for (let user of userlist) {
      this.users.splice(this.users.indexOf(user.id), 1);
    }
    this.modelChange.emit(this.users);
  }


  /**
   * Method which gets triggered on keyup i.e., when user tries to enter something on input
   * @param event represents the keyup event
   * Updates the list this.names which is fed to auto complete to have dynamic entries
   */
  public updateStudentList(event: any) {
    if (typeof event.target.value === 'undefined') {
      return;
    }
    if (event.target.value.length <= 2 || event.keyCode === 40 || event.keyCode === 38) {
      return;
    }
    this.userService.getUserNames(event.target.value, this.role).then(
      data => this.getNames(<User[]>data))
      .catch(
        error => this.errorMessage = <any>error
      );
  }

  public getNames(users: User[]) {
    this.names = [];
    for (let user of users) {
      this.names.push(user.email);
    }
  }

  public errorMessages = {
    'required': 'Atleast one user is required'
  };

  ngOnInit() {
    this.tagPlaceholder = ' +' + this.role;
  }
}