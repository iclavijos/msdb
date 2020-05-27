import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';

import { JhiPrivacyComponent } from './privacy/privacy.component';
import { JhiTermsConditionsComponent } from './terms-conditions/terms-conditions.component';

import { legalRoute } from './legal.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(legalRoute)],
  declarations: [JhiPrivacyComponent, JhiTermsConditionsComponent],
  exports: [JhiPrivacyComponent, JhiTermsConditionsComponent]
})
export class MotorsportsDatabaseLegalModule {}
