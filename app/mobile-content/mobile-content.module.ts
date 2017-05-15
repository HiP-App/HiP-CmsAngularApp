import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { mobileContentRouting } from './mobile-content.routing';
import { MobileContentApiService } from './mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  imports: [
    mobileContentRouting,
    NgxPaginationModule,
    SharedModule
  ],
  declarations: [
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent,
    EditExhibitComponent,
    ExhibitsComponent,
    MediaComponent,
    RoutesComponent,
    TagsComponent
  ],
  entryComponents: [
    CreateExhibitDialogComponent,
    DeleteExhibitDialogComponent
  ],
  providers: [
    MobileContentApiService
  ]
})
export class MobileContentModule { }
