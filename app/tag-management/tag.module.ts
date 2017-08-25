import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdButtonToggleModule, MdCardModule, MdDialogModule, MdIconModule,
  MdInputModule, MdSelectModule, MdTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from 'ng2-translate';

import { AllTagsComponent } from  './all-tags/all-tags.component';
import { AnnotationComponent } from  './annotation/annotation.component';
import { CanvasComponent } from './annotation/canvas/canvas.component';
import { CreateTagDialogComponent } from  './create-tag-dialog/create-tag-dialog.component';
import { DeleteTagDialogComponent } from  './delete-tag-dialog/delete-tag-dialog.component';
import { OOApiService } from '../shared/api/oo-api.service';
import { TagFrequencyComponent } from  './annotation/content-analysis/tag-frequency-analysis/tag-frequency-analysis.component';
import { TagInputComponent } from './all-tags/tag-list/tag-input/tag-input.component';
import { TagListComponent } from  './all-tags/tag-list/tag-list.component';
import { TagListItemComponent } from './all-tags/tag-list/tag-list-item/tag-list-item.component';
import { TagMenuComponent } from './annotation/tag-menu/tag-menu.component';
import { TagMenuItemComponent } from './annotation/tag-menu/tag-menu-item/tag-menu-item.component';
import { tagRouting } from  './tag.routing';
import { TagService } from './tag.service';
import { TagsFilterPipe } from './annotation/pipes/tags-filter.pipe';
import { TagsSorterPipe } from './annotation/pipes/tags-sorter.pipe';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragulaModule,
    FormsModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdDialogModule,
    MdIconModule,
    MdInputModule,
    MdSelectModule,
    MdTabsModule,
    tagRouting,
    TranslateModule
  ],
  declarations: [
    AllTagsComponent,
    AnnotationComponent,
    CanvasComponent,
    CreateTagDialogComponent,
    DeleteTagDialogComponent,
    TagFrequencyComponent,
    TagInputComponent,
    TagListComponent,
    TagListItemComponent,
    TagMenuComponent,
    TagMenuItemComponent,
    TagsFilterPipe,
    TagsSorterPipe
  ],
  entryComponents: [
    CreateTagDialogComponent,
    DeleteTagDialogComponent
  ],
  providers: [
    OOApiService,
    TagService
  ]
})
export class TagModule {}
