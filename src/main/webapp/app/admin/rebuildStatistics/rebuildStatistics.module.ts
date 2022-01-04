import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { JhiRebuildStatisticsComponent } from './rebuildStatistics.component';

import { rebuildStatisticsRoute } from './rebuildStatistics.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([rebuildStatisticsRoute])],
  declarations: [JhiRebuildStatisticsComponent]
})
export class RebuildStatisticsModule {}
