import { NgModule } from '@angular/core';
import { MdGridListModule } from '@angular/material';

import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { CreateTagDialogComponent } from './tags/create-tag-dialog/create-tag-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { DeleteMediumDialogComponent } from './media/delete-medium-dialog/delete-medium-dialog.component';
import { DeleteRouteDialogComponent } from './routes/delete-route-dialog/delete-route-dialog.component';
import { DeleteTagDialogComponent } from './tags/delete-tag-dialog/delete-tag-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { MediaGalleryComponent } from './media/media-gallery/media-gallery.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './shared/mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SelectMediumDialogComponent } from './media/select-medium-dialog/select-medium-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';
import { RouteService } from './routes/shared/routes.service';
import { UploadMediumDialogComponent } from './media/upload-medium-dialog/upload-medium-dialog.component';

@NgModule({
  imports: [
    MdGridListModule,
    mobileContentRouting,
    SharedModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  declarations: [
    CreateExhibitDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    DeleteRouteDialogComponent,
    DeleteTagDialogComponent,
    EditExhibitComponent,
    EditMediumDialogComponent,
    EditRouteComponent,
    EditTagComponent,
    ExhibitsComponent,
    MediaComponent,
    MediaGalleryComponent,
    RoutesComponent,
    SelectMediumDialogComponent,
    TagsComponent,
    UploadMediumDialogComponent
  ],
  entryComponents: [
    CreateExhibitDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    DeleteExhibitDialogComponent,
    DeleteMediumDialogComponent,
    DeleteRouteDialogComponent,
    DeleteTagDialogComponent,
    EditMediumDialogComponent,
    SelectMediumDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [MobileContentApiService, RouteService]
})
export class MobileContentModule {}
