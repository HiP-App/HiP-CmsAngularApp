import { NgModule } from '@angular/core';

import { ErrorPageComponent } from './error-page/error-page.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { pagesRouting } from './pages.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    pagesRouting,
    SharedModule
  ],
  declarations: [
    ErrorPageComponent,
    LegalNoticeComponent
  ]
})
export class PagesModule {}
