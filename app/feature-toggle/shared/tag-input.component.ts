import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { FeatureGroup } from '../feature-toggle.model'
import { FeatureToggleService } from '../feature-toggle.service'

@Component({
  moduleId: module.id,
  selector: 'hip-tag-input',
  templateUrl: 'tag-input.component.html',
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
export class TagInputComponent implements OnInit {
  public errorMessage: any;       // Handling error message
  public tagPlaceholder: string;  // The Placeholder for each Tag

  @Input() role: string = '';          // User role Passed dynamically
  @Input() users: FeatureGroup[];         // List of Users added to tag-input
  @Input() placeholder: string = 'User';   // Input for Placeholder
  @Input() maxItems: number = 90;      // Maximum Items for TagInut
  @Input() readonly: false;
  //@Output() usersChange = new EventEmitter<User[]>();

  constructor() {}

  ngOnInit() {
    this.tagPlaceholder = ' +' + this.role;
  }


}
