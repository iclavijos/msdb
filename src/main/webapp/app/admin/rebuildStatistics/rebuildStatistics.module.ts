import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';

import { JhiRebuildStatisticsComponent } from './rebuildStatistics.component';

import { rebuildStatisticsRoute } from './rebuildStatistics.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([rebuildStatisticsRoute])],
  declarations: [JhiRebuildStatisticsComponent]
})
export class RebuildStatisticsModule {}
