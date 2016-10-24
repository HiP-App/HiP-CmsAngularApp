import { Component, ElementRef, HostListener } from '@angular/core';
import { User } from '../../core/user/user.model';
import { UserService } from '../../core/user/user.service';

/**
 * Autocomplete component which fetches all users from the existing system
 * and provides possibility for autcomplete (email of existing user)
 *
 */

@Component({
  selector: 'hip-autocomplete',
  templateUrl: './app/shared/autocomplete/autocomplete.component.html',
  styleUrls: ['./app/shared/autocomplete/autocomplete.component.css']
})

export class AutocompleteComponent {
  public query = '';
  public names: string[] = [];
  public filteredList: string[] = [];
  selectedIdx: number;
  username = '';
  public users: User[] = [];
  public errorMessage: any;

  constructor(private userService: UserService, private elementRef: ElementRef) {
    this.selectedIdx = -1;
    this.getEmail();
    this.filteredList = [];
  }

  /**
   * Gets all exisiting users from the system.
   *
   */
  getEmail() {
    this.userService.getAll().then(
      (data: any) => this.getNames(<User[]> data))
      .catch(
        (error: any) => this.errorMessage = <any>error
      );
  }

  /**
   * Gets the email for every existing user in the system
   *
   */
  getNames(users: User[]) {
    for (let user of users) {
      this.names.push(user.email);
    }
  }

  /**
   * Filter the user input as the user types. Provides functionalities for arrow keys.
   *
   */
  filter(event: any) {
    if (this.query !== '') {
      this.filteredList = this.names.filter(function (el: string) {
        return (el.toLowerCase().substr(0, this.query.length) === this.query.toLowerCase()) === true;
      }.bind(this));
      // keydown
      if (event.keyCode === 40) {
        if (this.selectedIdx + 1 !== this.filteredList.length) {
          this.selectedIdx++;
        }
      }
      // keyup
      if (event.keyCode === 38) {
        if (this.selectedIdx > 0) {
          this.selectedIdx--;
        }
      }
      // enter
      if (event.keyCode === 13) {
        if (this.filteredList[this.selectedIdx] !== undefined) {
          this.select(this.filteredList[this.selectedIdx]);
        }
      }
    } else {
      this.filteredList = [];
    }
  }

  /**
   * Function for selection of item.
   *
   */
  select(item: any) {
    this.query = item;
    this.filteredList = [];
  }

  /**
   * Function for handling event-click.
   *
   */
  @HostListener('click', ['$event'])
  handleClick(event: any) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
    }
    this.selectedIdx = -1;
  }

  /**
   * Function for handling event-arrow keys.
   *
   */
  @HostListener('keydown', ['$event'])
  @HostListener('keyup', ['$event'])
  handleKeyDown(event: any) {
    if (event.keyCode === 40 || event.keyCode === 38) {
      event.preventDefault();
    }
  }
}









