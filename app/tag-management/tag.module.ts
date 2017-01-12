import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { tagRouting } from  './tag.routing';
import { AddSubTagComponent } from  './add-sub-tags/add-sub-tags.component';
import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { CanvasComponent } from './annotation/canvas/canvas.component';
import { DeleteTagComponent } from  './delete-tag/delete-tag.component';
import { CreateTagDialogComponent } from  './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from  './delete-tag-dialog/delete-tag-dialog.component';
import { EditTagComponent } from  './edit-tag/edit-tag.component';
import { NewTagComponent } from  './new-tag/new-tag.component';
import { RemoveSubTagComponent } from  './remove-sub-tags/remove-sub-tags.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { TagService } from './tag.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    tagRouting
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    CanvasComponent,
    DeleteTagComponent,
    CreateTagDialogComponent,
    DeleteTagDialogComponent,
    EditTagComponent,
    NewTagComponent,
    TagListComponent,
    RemoveSubTagComponent,
    AddSubTagComponent
  ],
  entryComponents: [
    CreateTagDialogComponent,
    DeleteTagDialogComponent
  ],
  providers: [TagService]
})
export class TagModule {}
