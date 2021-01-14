import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';

import { JhiRebuildSessionsNotificationsComponent } from './rebuildSessionsNotifications.component';

import { rebuildSessionsNotificationsRoute } from './rebuildSessionsNotifications.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([rebuildSessionsNotificationsRoute])],
  declarations: [JhiRebuildSessionsNotificationsComponent]
})
export class RebuildSessionsNotificationsModule {}
