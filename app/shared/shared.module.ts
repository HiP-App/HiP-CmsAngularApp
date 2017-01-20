import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PaginationModule } from 'ng2-pagination';
import { TagInputModule } from 'ng2-tag-input';
import { TranslateModule } from 'ng2-translate';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { DisplacerComponent } from './displacer/displacer.component';
import { DisplacerDirective } from './displacer/displacer.directive';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { PaginationComponent } from './pagination/pagination.component';
import { UserTagInputComponent } from './taginput/user-tag-input.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule.forRoot(),
    TagInputModule,
    TranslateModule,
    Ng2PaginationModule
  ],
  exports: [
    AutocompleteComponent,
    DisplacerComponent,
    UploadPictureComponent,
    UserTagInputComponent,
    PaginationComponent
  ],
  declarations: [
    AutocompleteComponent,
    DisplacerComponent,
    DisplacerDirective,
    UploadPictureComponent,
    UserTagInputComponent,
    PaginationComponent
  ]
})
export class SharedModule {}
