import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { TagRouting } from  './tag.routing';
import { AddSubTagComponent } from  './add-sub-tags/add-sub-tags.component';
import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { DeleteTagComponent } from  './delete-tag/delete-tag.component';
import { EditTagComponent } from  './edit-tag/edit-tag.component';
import { NewTagComponent } from  './new-tag/new-tag.component';
import { RemoveSubTagComponent } from  './remove-sub-tags/remove-sub-tags.component';
import { TagComponent } from './annotation/tag/tag.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { TagService } from './tag.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TagRouting,
    TranslateModule,
    MaterialModule,
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    EditTagComponent,
    DeleteTagComponent,
    NewTagComponent,
    TagComponent,
    TagListComponent,
    RemoveSubTagComponent,
    AddSubTagComponent
  ],
  providers: [TagService]
})
export class TagModule {}
