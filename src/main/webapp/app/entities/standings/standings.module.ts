import { NgModule } from '@angular/core';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';

import { ChartModule } from 'primeng-lts/chart';
import { CheckboxModule } from 'primeng-lts/checkbox';

import 'chart.js/dist/Chart.min.js';

import { StandingsComponent } from './standings.component';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, ChartModule, CheckboxModule],
  exports: [StandingsComponent],
  declarations: [StandingsComponent]
})
export class MotorsportsDatabaseStandingsModule {}
