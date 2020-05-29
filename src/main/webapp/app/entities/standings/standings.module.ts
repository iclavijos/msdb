import { NgModule } from '@angular/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';

import { ChartModule, CheckboxModule } from 'primeng/primeng';

import 'chart.js/dist/Chart.min.js';

import { StandingsComponent } from './standings.component';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, ChartModule, CheckboxModule],
  exports: [StandingsComponent],
  declarations: [StandingsComponent],
  entryComponents: [StandingsComponent]
})
export class MotorsportsDatabaseStandingsModule {}
