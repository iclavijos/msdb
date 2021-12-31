import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from '../shared/shared.module';

import { SubscriptionsComponent } from './subscriptions.component';
import { SUBSCRIPTIONS_ROUTE } from './subscriptions.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([SUBSCRIPTIONS_ROUTE])],
  declarations: [SubscriptionsComponent]
})
export class MotorsportsDatabaseSubscriptionsModule {}
