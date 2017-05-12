import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';
import { NgxPaginationModule } from 'ngx-pagination';

import { mobileContentRouting } from './mobile-content.routing';
import { CreateExhibitDialogComponent } from './exhibits/create-exhibit-dialog/create-exhibit-dialog.component';
import { DeleteExhibitDialogComponent } from './exhibits/delete-exhibit-dialog/delete-exhibit-dialog.component';
import { EditExhibitComponent } from './exhibits/edit-exhibit/edit-exhibit.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { MediaComponent } from './media/media.component';
import { MobileContentApiService } from './mobile-content-api.service';
import { RoutesComponent } from './routes/routes.component';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags/tags.component';


@NgModule({
  imports: [
    mobileContentRouting,
    BrowserModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    NgxPaginationModule,
    ReactiveFormsModule,
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
