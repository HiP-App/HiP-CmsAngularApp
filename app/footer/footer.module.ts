import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from 'ng2-translate';

import { footerRouting } from './footer.routing';
import { ContactComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    footerRouting,
  ],
  declarations: [
    ContactComponent,
    LegalNoticeComponent,
    HelpComponent
  ]
})
export class FooterModule {}
