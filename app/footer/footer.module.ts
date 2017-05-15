import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { footerRouting } from './footer.routing';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    footerRouting,
  ],
  declarations: [
    LegalNoticeComponent
  ]
})
export class FooterModule {}
