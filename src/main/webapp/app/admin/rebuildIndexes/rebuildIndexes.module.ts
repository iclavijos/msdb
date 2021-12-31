import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';

import { JhiRebuildIndexesComponent } from './rebuildIndexes.component';

import { rebuildIndexesRoute } from './rebuildIndexes.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([rebuildIndexesRoute])],
  declarations: [JhiRebuildIndexesComponent]
})
export class RebuildIndexesModule {}
