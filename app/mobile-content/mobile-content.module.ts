import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdAutocompleteModule, MdButtonModule, MdCardModule, MdDialogModule, MdGridListModule, MdIconModule, MdInputModule,
  MdListModule, MdSelectModule, MdSlideToggleModule, MdTabsModule, MdChipsModule } from '@angular/material';
import { TagInputModule } from 'ngx-chips';
import { TranslateModule } from 'ng2-translate';

import { AchievementApiService } from './shared/achievement-api.service';
import { AchievementsComponent } from './achievements/achievements.component';
import { AchievementService } from './achievements/shared/achievement.service';
import { ConfirmDeleteDialogComponent } from './shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { ChangeHistoryComponent } from './shared/change-history/change-history.component';
import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { CreatePageDialogComponent } from './pages/create-page-dialog/create-page-dialog.component';
import { CreateRouteDialogComponent } from './routes/create-route-dialog/create-route-dialog.component';
import { CreateTagDialogComponent } from './tags/create-tag-dialog/create-tag-dialog.component';
import { DurationsFilter } from './routes/shared/pipes/route-filter.pipe';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { EditMediumDialogComponent } from './media/edit-medium-dialog/edit-medium-dialog.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { EditRouteComponent } from './routes/edit-route/edit-route.component';
import { EditTagComponent } from './tags/edit-tag/edit-tag.component';
import { ExhibitPagesComponent } from './exhibits/exhibit-pages/exhibit-pages.component';
import { ViewExhibitComponent } from './exhibits/view-exhibit/view-exhibit.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { ExhibitService } from './exhibits/shared/exhibit.service';
import { MediaComponent } from './media/media.component';
import { MediaGalleryComponent } from './media/media-gallery/media-gallery.component';
import { MediaService } from './media/shared/media.service';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './shared/mobile-content-api.service';
import { MobilePageService } from './pages/shared/mobile-page.service';
import { PageInputComponent } from './pages/shared/page-input/page-input.component';
import { PageListComponent } from './pages/shared/page-list/page-list.component';
import { PagesComponent } from './pages/pages.component';
import { RatingComponent } from './shared/star-rating/star-rating.component';
import { RoutesComponent } from './routes/routes.component';
import { RouteService } from './routes/shared/routes.service';
import { SelectMediumDialogComponent } from './media/select-medium-dialog/select-medium-dialog.component';
import { SelectPageDialogComponent } from './pages/select-page-dialog/select-page-dialog.component';
import { SharedPaginationModule } from '../shared/shared-pagination.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TagsComponent } from './tags/tags.component';
import { TagService } from './tags/shared/tag.service';
import { ThumbnailApiService } from './shared/thumbnail-api.service';
import { ThumbnailService } from './shared/thumbnail.service';
import { UploadMediumDialogComponent } from './media/upload-medium-dialog/upload-medium-dialog.component';
import { ViewRouteComponent } from './routes/view-route/view-route.component';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGpVhncb65XwBrV_yWK8RHWcydDsLWCH4',
      libraries: ['places']
    }),
    CommonModule,
    FormsModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdCardModule,
    MdChipsModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdSelectModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdChipsModule,
    mobileContentRouting,
    ReactiveFormsModule,
    SharedPaginationModule,
    TagInputModule,
    TranslateModule
  ],
  declarations: [
    AchievementsComponent,
    ConfirmDeleteDialogComponent,
    ChangeHistoryComponent,
    CreateExhibitDialogComponent,
    CreatePageDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    DurationsFilter,
    EditExhibitComponent,
    EditMediumDialogComponent,
    EditPageComponent,
    EditRouteComponent,
    EditTagComponent,
    ExhibitPagesComponent,
    ViewExhibitComponent,
    ExhibitsComponent,
    MediaComponent,
    MediaGalleryComponent,
    PageInputComponent,
    PageListComponent,
    PagesComponent,
    RatingComponent,
    RoutesComponent,
    SelectMediumDialogComponent,
    SelectPageDialogComponent,
    TagsComponent,
    UploadMediumDialogComponent,
    ViewRouteComponent
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent,
    ChangeHistoryComponent,
    CreateExhibitDialogComponent,
    CreatePageDialogComponent,
    CreateRouteDialogComponent,
    CreateTagDialogComponent,
    EditMediumDialogComponent,
    SelectMediumDialogComponent,
    SelectPageDialogComponent,
    UploadMediumDialogComponent
  ],
  providers: [
    AchievementApiService,
    AchievementService,
    ExhibitService,
    MediaService,
    MobileContentApiService,
    MobilePageService,
    RouteService,
    TagService,
    ThumbnailApiService,
    ThumbnailService
  ]
})
export class MobileContentModule {}
