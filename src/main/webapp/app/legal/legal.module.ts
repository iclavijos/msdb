import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { JhiPrivacyComponent } from './privacy/privacy.component';
import { JhiTermsConditionsComponent } from './terms-conditions/terms-conditions.component';

import { legalRoute } from './legal.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(legalRoute)],
  declarations: [JhiPrivacyComponent, JhiTermsConditionsComponent],
  exports: [JhiPrivacyComponent, JhiTermsConditionsComponent]
})
export class MotorsportsDatabaseLegalModule {}
