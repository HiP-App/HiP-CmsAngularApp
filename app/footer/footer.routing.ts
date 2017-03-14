import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule }   from '@angular/router';

import { ContactComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

const footerRoutes: Routes = [
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'legal-notice',
    component: LegalNoticeComponent
  },
  {
    path: 'help',
    component: HelpComponent
  }
];

export const footerRouting: ModuleWithProviders = RouterModule.forChild(footerRoutes);
