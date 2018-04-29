import { NgModule } from '@angular/core';
import { MdCardModule, MdIconModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';

import { ErrorPageComponent } from './error-page/error-page.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { pagesRouting } from './pages.routing';

@NgModule({
  imports: [
    pagesRouting,
    MdCardModule,
    MdIconModule,
    TranslateModule
  ],
  declarations: [
    ErrorPageComponent,
    LegalNoticeComponent
  ]
})
export class PagesModule {}
