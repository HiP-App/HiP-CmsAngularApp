import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { TextareaComponent } from './textarea/textarea.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';

import TagInputComponent from './taginput/taginput.component';
import { TagInputModule } from 'ng2-tag-input';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TagInputModule
  ],
  declarations: [
    AutocompleteComponent,
    TextareaComponent,
    FluidHeightDirective,
    TagInputComponent
  ]
})
export class SharedModule {}

