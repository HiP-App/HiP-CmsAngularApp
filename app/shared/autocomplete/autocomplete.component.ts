  import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
  import { User } from '../../shared/user/user.model';
  import { UserService }      from '../../shared/user/user.service';
  import { MdButton } from '@angular2-material/button';
  import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
  import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';
  import { Router, ROUTER_DIRECTIVES }  from '@angular/router';
  import { MdCard } from '@angular2-material/card';
  import { HTTP_PROVIDERS } from '@angular/http';
  import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
  import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
  import { FORM_DIRECTIVES } from '@angular/common';
  import { CmsApiService } from '../../shared/api/cms-api.service';
  import { MdToolbar } from '@angular2-material/toolbar';

  /**
   * Autocomplete component which fetches all users from the existing system 
   * and provides possibility for autcomplete (email of existing user)
   * 
   */

  @Component({
    selector: 'hip-autocomplete',
    host: {
      '(document:click)': 'handleClick($event)',
      '(keydown)': 'handleKeyDown($event)',
      '(keyup)': 'handleKeyDown($event)'
    },
    templateUrl:'./app/shared/autocomplete/autocomplete.component.html',
    styleUrls: ['./app/shared/autocomplete/autocomplete.component.css'],
    viewProviders: [MdCard],
    providers: [UserService, CmsApiService],
    directives: [FORM_DIRECTIVES], 

  })

   export class AutocompleteComponent {
     public query = '';
     public names: string[] = [];
     public filteredList:string[]  = [];
     selectedIdx: number;
     username = '';
     public users: User[] = [];
     public errorMessage: any;

     constructor( private userService: UserService, private elementRef: ElementRef) {
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
        data => this.getNames(<User[]> data))
      .catch(
        error => this.errorMessage = <any>error
        );
    }

   /**
     * Gets the email for every existing user in the system
     * 
     */
    getNames(users: User[]) {
      for (let user of users) {
        this.names.push(user.email)
      }
    }

   /**
     * Filter the user input as the user types. Provides functionalities for arrow keys.
     * 
     */
    filter(event: any) {
       if (this.query !== "") {
         this.filteredList = this.names.filter(function (el:string) {
           return (el.toLowerCase().substr(0,this.query.length) === this.query.toLowerCase()) == true;
         }.bind(this));

        //keydown
        if (event.keyCode == 40) {
           if (this.selectedIdx + 1 != this.filteredList.length)
            this.selectedIdx++;
         }

        //keyup
        if (event.keyCode == 38) {
           if (this.selectedIdx > 0)
             this.selectedIdx--;
         }

        //enter
        if (event.keyCode == 13) {
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
  handleClick(event: any) {
    var clickedComponent = event.target;
    var inside = false;
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

  handleKeyDown(event: any) {
   if (event.keyCode == 40 || event.keyCode == 38) {
        event.preventDefault();
      }
    }

  }









