import { Routes } from '@angular/router';

import { JhiPrivacyComponent } from './privacy/privacy.component';
import { JhiTermsConditionsComponent } from './terms-conditions/terms-conditions.component';

export const legalRoute: Routes = [
  {
    path: 'privacy',
    component: JhiPrivacyComponent,
    data: {
      pageTitle: 'Privacy'
    }
  },
  {
    path: 'terms-conditions',
    component: JhiTermsConditionsComponent,
    data: {
      pageTitle: 'Terms & Conditions'
    }
  }
];
