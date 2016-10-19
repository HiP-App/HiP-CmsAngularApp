﻿import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'hip-taginput',
  templateUrl: './app/shared/taginput/taginput.component.html'
})
export class TagInputComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.users);
    this.usernames = [];
    for (let user of this.users) {
      this.usernames.push(user.email);
    }
  }


  public errorMessage: any;       // Handling error message
  public names: string[] = [];    // AutoComplete List
  public tagPlaceholder: string;  // The Placeholder for each Tag

  @Input() usernames: string[];   // Default List, used incase of update model
  @Input() role: string;          // User role Passed dynamically
  @Input() users: User[];         // List of Users added to tag-input
  @Input() placeholder: string;   // Input for Placeholder
  @Input() maxItems: number;      // Maximum Items for TagInut
  @Output() usersChange = new EventEmitter<User[]>();

  constructor(private userService: UserService) {
  }

  updateData() {
    this.usersChange.emit(this.users);
  }

  /**
   * Callback for Adding Users from Auto complete List
   * @param item represents the tag which is being added(by clicking enter or by mouse from dropdown)
   */
  public onAdd(item: any) {
    this.userService.getUserbyEmail(item).then(
      (data: any) => this.setUser(<User[]>data))
      .catch(
        (error: any) => this.errorMessage = <any>error
      );
  }

  public setUser(userlist: User[]) {
    for (let user of userlist) {
      this.users.push(user);
    }
  }


  /**
   * Callback for Removing Users from Tag input
   * @param item represents the tag which is being removed
   */
  public onRemove(item: any) {
    this.userService.getUserbyEmail(item).then(
      (data: any) => this.unsetUser(<User[]>data))
      .catch(
        (error: any) => this.errorMessage = <any>error
      );
  }

  public unsetUser(userlist: User[]) {
    for (let user of userlist) {
      this.users = this.users.filter(function (obj) {
        return obj.id != user.id;
      });
    }
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
    this.userService.getUserNames(event.target.value, this.role).then(
      (data: any) => this.getNames(<User[]>data))
      .catch(
        (error: any) => this.errorMessage = <any>error
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
