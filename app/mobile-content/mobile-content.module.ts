import { AgmCoreModule } from '@agm/core/core.umd';
import { NgModule } from '@angular/core';
import { MdGridListModule, MdSlideToggleModule } from '@angular/material';

import { ConfirmDeleteDialogComponent } from './shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { CreateTagDialogComponent } from './tags/create-tag-dialog/create-tag-dialog.component';
import { DurationsFilter } from './routes/shared/pipes/route-filter.pipe';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditExhibitPagesComponent } from './exhibits/edit-exhibit-pages/edit-exhibit-pages.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { EditPageDialogComponent } from './pages/edit-page-dialog/edit-page-dialog.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { ExhibitService } from './exhibits/shared/exhibit.service';
import { MediaComponent } from './media/media.component';
import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { MediaGalleryComponent } from './media/media-gallery/media-gallery.component';
import { MediaService } from './media/shared/media.service';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './shared/mobile-content-api.service';
import { MobilePageService } from './pages/shared/mobile-page.service';
import { PageInputComponent } from './pages/shared/page-input/page-input.component';
import { PageListComponent } from './pages/shared/page-list/page-list.component';
import { PagesComponent } from './pages/pages.component';
import { RoutesComponent } from './routes/routes.component';
import { SelectMediumDialogComponent } from './media/select-medium-dialog/select-medium-dialog.component';
import { SelectPageDialogComponent } from './pages/select-page-dialog/select-page-dialog.component';
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
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGpVhncb65XwBrV_yWK8RHWcydDsLWCH4'
    })
  ],
  declarations: [
    ConfirmDeleteDialogComponent,
    CreateExhibitDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    DurationsFilter,
    EditExhibitComponent,
    EditExhibitPagesComponent,
    EditMediumDialogComponent,
    EditPageDialogComponent,
    EditRouteComponent,
    EditTagComponent,
    ExhibitsComponent,
    MediaComponent,
    MediaGalleryComponent,
    PageInputComponent,
    PageListComponent,
    PagesComponent,
    RoutesComponent,
    SelectMediumDialogComponent,
    SelectPageDialogComponent,
    TagsComponent,
    UploadMediumDialogComponent
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent,
    CreateExhibitDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    EditMediumDialogComponent,
    EditPageDialogComponent,
    SelectMediumDialogComponent,
    SelectPageDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [
    ExhibitService,
    MediaService,
    MobileContentApiService,
    MobilePageService,
    RouteService,
    TagService
  ]
})
export class MobileContentModule {}
