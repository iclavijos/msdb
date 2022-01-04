import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { SubscriptionsComponent } from './subscriptions.component';
import { SUBSCRIPTIONS_ROUTE } from './subscriptions.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([SUBSCRIPTIONS_ROUTE])],
  declarations: [SubscriptionsComponent]
})
export class MotorsportsDatabaseSubscriptionsModule {}
