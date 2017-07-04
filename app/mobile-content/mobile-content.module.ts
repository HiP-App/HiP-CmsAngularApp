import { NgModule } from '@angular/core';
import { MdGridListModule, MdSlideToggleModule } from '@angular/material';

import { ConfirmDeleteDialogComponent } from './shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreateExhibitPageDialogComponent } from './exhibits/create-exhibit-page-dialog/create-exhibit-page-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { CreateTagDialogComponent } from './tags/create-tag-dialog/create-tag-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditExhibitPagesComponent } from './exhibits/edit-exhibit-pages/edit-exhibit-pages.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitPageInputComponent } from './exhibits/shared/exhibit-page-input/exhibit-page-input.component';
import { ExhibitPageService } from './exhibits/shared/exhibit-page.service';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { ExhibitService } from './exhibits/shared/exhibit.service';
import { MediaComponent } from './media/media.component';
import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { MediaGalleryComponent } from './media/media-gallery/media-gallery.component';
import { MediaService } from './media/shared/media.service';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './shared/mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SelectMediumDialogComponent } from './media/select-medium-dialog/select-medium-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';
import { RouteService } from './routes/shared/routes.service';
import { TagService } from './tags/shared/tag.service';
import { UploadMediumDialogComponent } from './media/upload-medium-dialog/upload-medium-dialog.component';

@NgModule({
  imports: [
    MdGridListModule,
    MdSlideToggleModule,
    mobileContentRouting,
    SharedModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  declarations: [
    ConfirmDeleteDialogComponent,
    CreateExhibitDialogComponent,
    CreateExhibitPageDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    EditExhibitComponent,
    EditExhibitPagesComponent,
    EditMediumDialogComponent,
    EditRouteComponent,
    EditTagComponent,
    ExhibitPageInputComponent,
    ExhibitsComponent,
    MediaComponent,
    MediaGalleryComponent,
    RoutesComponent,
    SelectMediumDialogComponent,
    TagsComponent,
    UploadMediumDialogComponent
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent,
    CreateExhibitDialogComponent,
    CreateExhibitPageDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    EditMediumDialogComponent,
    SelectMediumDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [
    ExhibitPageService,
    ExhibitService,
    MediaService,
    MobileContentApiService,
    RouteService,
    TagService
  ]
})
export class MobileContentModule {}
