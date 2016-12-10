import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { inviteUsersRouting } from './invite-users.routing';

import { AutocompleteComponent } from '../shared/autocomplete/autocomplete.component';
import { TagInputComponent } from '../shared/taginput/taginput.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TagInputModule,
    TranslateModule
  ],
  declarations: [
    AutocompleteComponent,
  ]
})
export class InviteUserModule {}

