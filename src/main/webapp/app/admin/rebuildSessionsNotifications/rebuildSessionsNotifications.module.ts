import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { JhiRebuildSessionsNotificationsComponent } from './rebuildSessionsNotifications.component';

import { rebuildSessionsNotificationsRoute } from './rebuildSessionsNotifications.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([rebuildSessionsNotificationsRoute])],
  declarations: [JhiRebuildSessionsNotificationsComponent]
})
export class RebuildSessionsNotificationsModule {}
