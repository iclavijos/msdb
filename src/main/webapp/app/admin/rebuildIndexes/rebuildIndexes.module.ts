import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { JhiRebuildIndexesComponent } from './rebuildIndexes.component';

import { rebuildIndexesRoute } from './rebuildIndexes.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([rebuildIndexesRoute])],
  declarations: [JhiRebuildIndexesComponent]
})
export class RebuildIndexesModule {}
