import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { MaterialModule } from '@angular/material';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { TextareaComponent } from './textarea/textarea.component';
import { FluidHeightDirective } from './textarea/fluid-height.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    AutocompleteComponent,
    // TextareaComponent,
    FluidHeightDirective,
    UploadPictureComponent
  ],
  declarations: [
    AutocompleteComponent,
    // TextareaComponent,
    FluidHeightDirective,
    UploadPictureComponent
  ]
})
export class SharedModule {}
