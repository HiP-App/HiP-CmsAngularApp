import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { TextareaComponent } from './textarea/textarea.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AutocompleteComponent,
    TextareaComponent,
    FluidHeightDirective
  ]
})
export class SharedModule {}

