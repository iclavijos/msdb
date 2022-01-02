import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';

import { JhiHealthCheckComponent } from './health.component';
import { JhiHealthModalComponent } from './health-modal.component';

import { healthRoute } from './health.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([healthRoute])],
  declarations: [JhiHealthCheckComponent, JhiHealthModalComponent]
})
export class HealthModule {}
